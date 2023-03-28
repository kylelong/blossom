import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {CheckIcon} from "@radix-ui/react-icons";
import "./dropdownmenu.css";

const Dropdown = ({surveys, setSelectedSurveyId}) => {
  const [surveyId, setSurveyId] = React.useState(false);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="SurveyButton" aria-label="Customise options">
          surveys
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          {surveys.map((survey) => {
            return (
              <DropdownMenu.CheckboxItem
                className="DropdownMenuCheckboxItem"
                checked={surveyId === survey.id}
                onCheckedChange={() => {
                  setSurveyId(survey.id);
                  setSelectedSurveyId(survey.id);
                }}
                key={survey.id}
              >
                <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                  <CheckIcon />
                </DropdownMenu.ItemIndicator>
                {survey.title}
              </DropdownMenu.CheckboxItem>
            );
          })}

          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
