export enum Subject {
  MATHEMATICS = "mathematics",
  SCIENCE = "science",
  ENGLISH = "english",
}

export interface QuizChoices {
  choice: string;
  content: string;
}

export interface QuizQuestion {
  number: number;
  question: string;
  choices: QuizChoices[];
  answer: string;
}
