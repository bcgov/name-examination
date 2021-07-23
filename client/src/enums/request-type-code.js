/**
 * Enum for Request (type) codes.
 * Codes that are used/supported in Namex and externally.
 * Used for mapping conversions to support namex ui's split requests.
 * */
const RequestTypeCode = {
  CR: 'CR', // new request for a BC Company
  ACR: 'ACR', // amalgamation request for a BC.Company **NOT YET SUPPORTED EXTERNALLY**
  XCR: 'XCR', // new request for an Extra-provincial Corporation
  XACR: 'XACR', // amalgamation request for a Extra-provincial Corporation **NOT YET SUPPORTED EXTERNALLY**
  CP: 'CP', // new request for a Cooperative
  ACP: 'ACP', // amalgamation request for a Cooperative
  CC: 'CC', // new request for a CCC,
  ACC: 'ACC', // amalgamation request for a CCC
  FR: 'FR', // new request for a Sole Prop,
  CFR: 'CFR', // change of name request for a Sole Prop
  GP: 'GP', // new request for a general partnership,
  CGP: 'CGP', // change of name request for a general partnership
}

export default Object.freeze(RequestTypeCode)
