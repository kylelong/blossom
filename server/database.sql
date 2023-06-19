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
    responses INT NULL DEFAULT 0,
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

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for insertion


/** to reset surveys :
    drop table response cascade;
    drop table answer_choice cascade;
    drop table question cascade;
    drop table survey cascade;


    -- to delete everuthing 
    drop table users cascade;
**/



/* 
    TESTING:
    create users, survey, question, answer_choice, response

    drop tables: drop table ___ cascade;
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

-- analytics
-- answer_id

 SELECT ac.choice, COUNT(ac.choice) FROM answer_choice ac INNER JOIN response r ON r.answer_id = ac.id WHERE r.question_id = 233 GROUP BY ac.choice;
 
 -- open_ended / emoji
 SELECT answer FROM response r INNER JOIN question q ON r.question_id = q.id WHERE r.question_id = ?;

/*
    TABLE CHANGES 

    -- add column -- ALTER TABLE question ADD COLUMN hash VARCHAR(255) UNIQUE NULL;

   -- alter column --  ALTER TABLE answer_choice ALTER COLUMN hash SET NOT NULL;

*/

/** to reset surveys :
delete from answer_choice;
delete from question;
delete from survey
**/

/* 
    ALL QUERIES LABELED BY PAGE

    get all answers per question per survey
    -- SELECT q.title, q.type, ac.index AS answer_index, ac.choice FROM question q INNER JOIN survey s ON s.id = q.survey_id INNER JOIN answer_choice ac ON ac.question_id = q.id WHERE s.id = 6;

    DASHBOARD
     # of surveys
        SELECT COUNT(*) FROM survey WHERE user_id =  ${}

     # of questions 
         SELECT COUNT(q.id) from survey s INNER JOIN question q ON s.id = q.survey_id WHERE s.user_id = ${}

     # of responses TODO:**
        SELECT COUNT(r.id) FROM resposnes r INNER JOIN question q ON r.question_id = q.id WHERE q.survey_id = ${}

    CREATE


    SURVEYS

    ** UPDATE NUMBER OF QUESTIONS AT END OF SURVEY **

    ANALYTICS 

    get survey id from answer_choice
        -- select q.survey_id from question q INNER JOIN answer_choice ac ON q.id = ac.question_id WHERE q.survey_id = ${};

    get all questions from survey

    get all answer choices for a question
        -- select ac.choice, count(ac.choice) from answer_choice ac INNER JOIN response r ON  ac.id = r.answer_id WHERE 
            r.question_id = ${} GROUP BY ac.choice;

    get all responses for a survey

    -- select * from survey where question_id = 
-- select * from question where survey_id = 6;
-- select * answer_choice where id = ${question_id}
-- SELECT q.title, q.type, ac.index AS answer_index, ac.choice FROM question q INNER JOIN survey s ON s.id = q.survey_id INNER JOIN answer_choice ac ON ac.question_id = q.id WHERE s.id = 8;
-- SELECT COUNT(*) FROM survey WHERE user_id = 1;
SELECT q.type, COUNT(q.type) FROM question q INNER JOIN survey s ON s.id = q.survey_id WHERE s.user_id = 1 AND q.type <> '' GROUP BY type;



*/

/* Add group_responses */
ALTER TABLE survey ADD COLUMN group_responses BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE response ADD COLUMN response_hash VARCHAR(255) NOT NULL DEFAULT '';

select id, answer_id, question_id, answer, created_at, response_hash  from response WHERE response_hash != ''  GROUP BY response_hash, id ORDER BY created_at DESC;
select *  from response r INNER JOIN question q ON q.id = r.question_id WHERE r.response_hash != ''  GROUP BY r.response_hash, q.index, r.id, q.id ORDER BY q.index ASC;