interface PersonalInfo {
  profile: string;
  name: string;
  email: string;
  image?: string;
  sub: string;
}

export interface User {
  personalInfo?: PersonalInfo;
  roles: string[];
}
