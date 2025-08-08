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

export interface Ibuilding {
  buildingId: number,
  siteId: number,
  buildingName: string,
  buildingManagerName: string,
  contactNo: string,
  siteName: string
}

export interface Ifloor {
  floorId: number,
  buildingId: number,
  floorNo: string,
  isOperational: boolean,
  totalParkingSpots: number
}

export interface IParkingBooking {
  parkId: number;
  floorId: number;
  custName: string | null;
  custMobileNo: string;
  vehicleNo: string;
  parkDate: Date | string;
  parkSpotNo: number;
  inTime: Date | string;
  outTime: Date | string | null;
  amount: number;
  extraCharge: number;
  parkingNo: string;
}