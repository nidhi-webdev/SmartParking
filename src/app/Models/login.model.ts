export interface login {
  emailId: string;
  password: string;
}

export interface userLogin {
  userId: number;
  emailId: string;
  password: string;
  createdDate: string;
  projectName: string;
  fullName: string;
  mobileNo: string;
  extraId: number;
}

export interface responseModel {
  message: string;
  result: string;
  data: any;
}

export interface Isite {
  siteId: number;
  clientId: number;
  siteName: string;
  siteCity: string;
  siteAddress: string;
  sitePinCode: string;
  totalBuildings: number;
  createdDate: string;
}
