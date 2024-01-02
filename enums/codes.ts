export enum RequestActionCode {
  /** new request*/
  NEW = 'NEW',
  /** move request */
  MVE = 'MVE',
  /** restore or reinstate request */
  REH = 'REH',
  /** amalgamate request */
  AML = 'AML',
  /** change name request */
  CHG = 'CHG',
  /** conversion request */
  CNV = 'CNV',
  /** doing business as request */
  DBA = 'DBA',
  /** assumed name request */
  ASSUMED = 'ASSUMED',
  /** restore with new name request (renew) */
  REN = 'REN',
  /** special value for sub-menu */
  INFO = 'INFO',
  /** restore */
  REST = 'REST',
}

export enum RequestTypeCode {
  /** new request for a BC Company */
  CR = 'CR',
  /** amalgamation request for a BC.Company **NOT YET SUPPORTED EXTERNALLY** */
  ACR = 'ACR',
  /** new request for an Extra-provincial Corporation */
  XCR = 'XCR',
  /** amalgamation request for a Extra-provincial Corporation **NOT YET SUPPORTED EXTERNALLY** */
  XACR = 'XACR',
  /** new request for a Cooperative */
  CP = 'CP',
  /** amalgamation request for a Cooperative */
  ACP = 'ACP',
  /** new request for a CCC */
  CC = 'CC',
  /** amalgamation request for a CCC */
  ACC = 'ACC',
  /** new request for a Sole Prop */
  FR = 'FR',
  /** change of name request for a Sole Prop */
  CFR = 'CFR',
  /** new request for a general partnership */
  GP = 'GP',
  /** change of name request for a general partnership */
  CGP = 'CGP',
}

export enum EntityTypeCode {
  /** General Partnership */
  GP = 'GP',
  CR = 'CR',
  XCR = 'XCR',
  RLC = 'RLC',
  FR = 'FR',
  LL = 'LL',
  XLL = 'XLL',
  LP = 'LP',
  XLP = 'XLP',
  CP = 'CP',
  XCP = 'XCP',
  CC = 'CC',
  UL = 'UL',
  UC = 'UC',
  XUL = 'XUL',
  FI = 'FI',
  PA = 'PA',
  PAR = 'PAR',
  BC = 'BC',
  BECV = 'BECV',
  BECR = 'BECR',
}

export enum ClassTypeCode {
  CORP = 'CORP',
  FIRM = 'FIRM',
  MISC = 'MISC',
}

export enum RefundState {
  Requested = 'Refund has been requested',
  NotProcessed = 'Refund not processed',
  Processed = 'Refund request processed',
  Cancelled = 'Payment cancelled',
  Credited = 'Funds have been credited',
  Completed = 'Refund process is completed',
}
