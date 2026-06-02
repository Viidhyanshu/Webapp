export interface EstimateRow {
  id: string;
  type: 'section' | 'item' | 'sub-item' | 'filler';
  slNo?: string;
  sorNo?: string;
  description?: string;
  unit?: string;
  rate?: string;
  quantity?: string;
  source?: 'BSR' | 'DSR' | 'MR';
  fillerColumn?: 'BSR' | 'DSR' | 'MR';
}

export interface ProjectDetails {
  firmName: string;
  subtitle: string;
  approvedBy: string;
  phone: string;
  email: string;
  title: string;
  floorName: string;
  floorArea: string;
  estimatedCostText: string;
  heightOfBuilding: string;
}

export const DEFAULT_PROJECT_DETAILS: ProjectDetails = {
  firmName: 'DEVYANSHU HOME',
  subtitle: 'SOLUTIONS',
  approvedBy: 'APROVED BY- UDHD',
  phone: '+91-7004621694',
  email: 'devyansuhomesolutions@gmail.com',
  title: 'PROPOSED RESIDENTIAL BUILDING FOR:- DEEPALI YADAV, D/O- RADHE SHYAM YADAV, HAVING THANA NO.- 346 ,SURVEY NO.- 790, KHATA NO.- 83, TAUZI NO.- 983, MAUZA- ATARSUAA, DISTRICT - SIWAN,',
  floorName: 'G.FLOOR',
  floorArea: '291.12',
  estimatedCostText: '56.84',
  heightOfBuilding: '3.40mt'
};

export const DEFAULT_ROWS: EstimateRow[] = [];

export const parseNum = (val: string | undefined): number => {
  if (!val) return 0;
  const parsed = parseFloat(val.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateRowAmount = (row: EstimateRow): number => {
  if (row.type !== 'item' && row.type !== 'sub-item') return 0;
  return parseNum(row.rate) * parseNum(row.quantity);
};

export const numberToWordsInIndianStyle = (num: number): string => {
  const a = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
    'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ];
  const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  const g = (n: number): string => {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
  };

  const h = (n: number): string => {
    if (n < 100) return g(n);
    const digit = n % 100;
    return a[Math.floor(n / 100)] + ' HUNDRED' + (digit ? ' AND ' + g(digit) : '');
  };

  const val = Math.round(num);
  if (val === 0) return 'ZERO ONLY';

  let str = '';
  let temp = val;

  if (temp >= 10000000) {
    str += h(Math.floor(temp / 10000000)) + ' CRORES ';
    temp %= 10000000;
  }
  if (temp >= 100000) {
    str += h(Math.floor(temp / 100000)) + ' LAKHS ';
    temp %= 100000;
  }
  if (temp >= 1000) {
    str += h(Math.floor(temp / 1000)) + ' THOUSAND ';
    temp %= 1000;
  }
  if (temp > 0) {
    str += h(temp) + ' ';
  }

  return str.trim() + ' ONLY';
};
