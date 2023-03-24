--- create database
CREATE DATABASE blossom;

-- index 
    -- CREATE INDEX index_name ON table_name (column_name);
    -- select * from pg_indexes where tablename = 'survey';

--- users
    -- maybe premium should be false if not entering uesrs until paid
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    company VARCHAR(255) NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    premium BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO users(company, email, password) 
VALUES ('google', 'kylelong9506@gmail.com', crypt('', gen_salt('bf'))) RETURNING *;

--  SELECT (password = crypt('', password)) AS pswmatch FROM users;
-- SELECT (password = crypt('', password)) AS pswmatch FROM users WHERE email = 'kylelong9506@gmail.com'

-- survey
    -- default number_of_questions is 1 because clicking add question starts a survey
CREATE TABLE survey (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hash VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    number_of_questions INT NOT NULL DEFAULT 1,
    user_id INT NOT NULL REFERENCES users,
    redirect_url VARCHAR(255) NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX hash_index ON survey (hash);
CREATE INDEX user_id_index ON survey (user_id);

-- question 
-- TODO: add hash
CREATE TABLE question (
    id SERIAL PRIMARY KEY,
    survey_id INT NOT NULL REFERENCES survey,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    hash VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT '',
    index INT NOT NULL,
    type VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE INDEX survey_id_index ON question (survey_id);

-- answer_choice
-- TODO: add hash

CREATE TABLE answer_choice (
    id SERIAL PRIMARY KEY,
    choice VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    hash VARCHAR(255) UNIQUE NOT NULL,
    index INT NOT NULL,
    question_id INT NOT NULL REFERENCES question
);

CREATE INDEX question_id_index ON answer_choice (question_id);

-- response 
/*
    answer is only for open_ended & emoji type questions
    open_ended & emoji : no answer_id, question_id, answer   
    multi_select & single_select : answer_id, question_id, no answer
 */

CREATE TABLE response (
    id SERIAL PRIMARY KEY,
    answer_id INT NULL REFERENCES answer_choice,
    question_id INT NOT NULL REFERENCES question,
    answer VARCHAR(255) NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX answer_id_index ON response (answer_id);
CREATE INDEX question_id_index_response ON response (question_id);

/* 
    TESTING:
    create survey, question, answer_choice, response
*/

INSERT INTO survey (title, hash, user_id) VALUES ('podcast', 'd5f8c6e5a3b49c6b5e07', 1) RETURNING*;
INSERT INTO survey (title, hash, user_id) VALUES ('running', '9d21bf3c7f3e33aebd7a', 1) RETURNING*;

INSERT INTO question (survey_id, index, type) VALUES (1, 0, 'open_ended');
INSERT INTO response (question_id, answer) VALUES (1, 'new rory & mal'); -- for open_ended question 
-- INSERT INTO response (question_id, answer) VALUES (#, '0x1F60D'); -- emoji
UPDATE question SET title = 'what is your favorite podcast?' WHERE id = 1;

-- create second question for survey 1 with 5 answer choices
INSERT INTO question (survey_id, title, index, type) VALUES (1, 'what platforms do you use to access your podcasts?', 1, 'multi_select');
INSERT INTO answer_choice (choice, index, question_id) VALUES ('spotify', 0, 2);
INSERT INTO answer_choice (choice, index, question_id) VALUES ('youtube', 1, 2);
INSERT INTO answer_choice (choice, index, question_id) VALUES ('apple podcast', 2, 2);
INSERT INTO answer_choice (choice, index, question_id) VALUES ('tik tok', 3, 2);
INSERT INTO answer_choice (choice, index, question_id) VALUES ('stitcher', 4, 2);

-- response
INSERT INTO response (answer_id, question_id) VALUES (1, 1);
INSERT INTO response (answer_id, question_id) VALUES (2, 1);
INSERT INTO response (answer_id, question_id) VALUES (4, 1);

/*
    TABLE CHANGES 

    -- add column -- ALTER TABLE question ADD COLUMN hash VARCHAR(255) UNIQUE NULL;

   -- alter column --  ALTER TABLE answer_choice ALTER COLUMN hash SET NOT NULL;

*/

/* 
    ALL QUERIES LABELED BY PAGE

    get all answers per question per survey
    -- SELECT q.title, q.type, ac.index AS answer_index, ac.choice FROM question q INNER JOIN survey s ON s.id = q.survey_id INNER JOIN answer_choice ac ON ac.question_id = q.id WHERE s.id = 6;

    DASHBOARD
     # of surveys
        SELECT COUNT(*) FROM survey WHERE user_id =  ${}

     # of questions 
         SELECT COUNT(q.id) from survey s INNER JOIN question q ON s.id = q.survey_id WHERE s.user_id = ${}

     # of responses 
        SELECT COUNT(r.id) FROM resposnes r INNER JOIN question q ON r.question_id = q.id WHERE q.survey_id = ${}

    CREATE


    SURVEYS

    ** UPDATE NUMBER OF QUESTIONS AT END OF SURVEY **

    -- get all surveys for this users : surveys page
        SELECT title from survey WHERE user_id = ${} ORDER BY created_at DESC; -- left panel of titles 

    -- get survey for preview
        # questions 
        SELECT title, type, index FROM question WHERE survey_id = ${} ORDER BY index ASC;
        -- if type is open_ended || emoji then prefill

        # answers
        -- needed only if question type is multi_select || single select otherwise prefill
        SELECT choice FROM answer_choice WHERE question_id = ${current_question_id} ORDER BY index ASC;





    ANALYTICS 

    get survey id from answer_choice
        -- select q.survey_id from question q INNER JOIN answer_choice ac ON q.id = ac.question_id WHERE q.survey_id = ${};

    get all questions from survey

    get all answer choices for a question
        -- select ac.choice, count(ac.choice) from answer_choice ac INNER JOIN response r ON  ac.id = r.answer_id WHERE 
            r.question_id = ${} GROUP BY ac.choice;

    get all responses for a survey



*/