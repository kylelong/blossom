type User = {
  company: string;
  confirmed: boolean;
  email: string;
  emailVerified: boolean;
  uid: string;
  contact: {
    firstName: string;
    lastName: string;
  };
  premium: boolean;
};

export default User;
