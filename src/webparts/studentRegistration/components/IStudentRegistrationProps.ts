import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IStudentRegistrationProps {
  context:WebPartContext
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
