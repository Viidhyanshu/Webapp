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

export const DEFAULT_ROWS: EstimateRow[] = [
  { id: 'sec-1', type: 'section', description: 'BSR / DSR' },
  { id: 'sec-2', type: 'section', description: 'SUB-HEAD-1 EARTHWORKS' },
  { 
    id: 'row-1', 
    type: 'item', 
    slNo: '1', 
    sorNo: '2.8', 
    description: 'Earth work in excavation by mechanical means (Hydraulic excavator)/ manual means in foundation trenches or drains ( not exceeding 1.5m in width or 10Sqm on plan), inculding dressing of sides and ramming of bottoms, lift upto 1.5m, including getting out the excavated soil and discoposol of surplus excavated soil as directed, within a lead of 50m.' 
  },
  { 
    id: 'row-2', 
    type: 'sub-item', 
    sorNo: '2.8.1', 
    description: 'All kinds of soil', 
    unit: 'Cum.', 
    rate: '479.4', 
    quantity: '369.60', 
    source: 'BSR' 
  },
  { id: 'row-3', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-4', 
    type: 'item', 
    slNo: '2', 
    sorNo: '2.26', 
    description: 'Filling available excavated earth (excluding rock) in trenches, plinth, sides of foundations etc. in layers not exceeding 20 cm in depth: consolidating each deposited layer by ramming and watering lead', 
    unit: 'Cum.', 
    rate: '154.95', 
    quantity: '138.06', 
    source: 'BSR' 
  },
  { id: 'row-5', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-6', 
    type: 'item', 
    slNo: '3', 
    sorNo: '2.28', 
    description: 'Supplying and filling in plinth with local sand under floors including watering, ramming, consolidating and dressing complete.', 
    unit: 'Cum.', 
    rate: '357.9', 
    quantity: '8.55', 
    source: 'BSR' 
  },
  { id: 'row-7', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-8', 
    type: 'item', 
    slNo: '4', 
    sorNo: 'D.S.R 2.34.1', 
    description: 'Supplying chemical emulsion in sealed containers including delivery as specified (chlorpyriphos/ lindane emulsifiable concentrate of 20%)', 
    unit: 'Litre', 
    rate: '278.925', 
    quantity: '5.41', 
    source: 'DSR' 
  },
  { id: 'row-9', type: 'filler', fillerColumn: 'BSR' },
  { id: 'sec-3', type: 'section', description: 'SUB-HEAD-2 MASONARY WORKS' },
  { 
    id: 'row-10', 
    type: 'item', 
    slNo: '5', 
    sorNo: '11.72', 
    description: 'Providing designation 100 A one brick flat soling joints filled with local sand including cost of watering, taxes, royalty all complete as per building specification and direction of E/I,', 
    unit: 'Sqm.', 
    rate: '416.25', 
    quantity: '60.90', 
    source: 'BSR' 
  },
  { id: 'row-11', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-12', 
    type: 'item', 
    slNo: '6', 
    sorNo: '6.1C', 
    description: 'Brick work with fly ash bricks as per IS 12894(2002) & IS 3495 in foundations and plinth in :' 
  },
  { 
    id: 'row-13', 
    type: 'sub-item', 
    sorNo: '6.1.12C', 
    description: 'Cement mortar 1:4 (1 cement: 4 coarse sand )', 
    unit: 'Cum.', 
    rate: '7694.55', 
    quantity: '36.27', 
    source: 'BSR' 
  },
  { id: 'row-14', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-15', 
    type: 'sub-item', 
    slNo: '6.1', 
    sorNo: '6.3C', 
    description: 'Extra tor Brick work in superstructure above plinth level upto floor V level cum', 
    unit: 'Cum.', 
    rate: '8747.85', 
    quantity: '86.29', 
    source: 'BSR' 
  },
  { id: 'row-16', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-17', 
    type: 'item', 
    slNo: '7', 
    sorNo: 'BSR + MR', 
    description: 'Half brick masonry with non modular fly ash bricks of class designation 10, conformingia IS :12894, in super structure above plinth and upto floor V level.' 
  },
  { 
    id: 'row-18', 
    type: 'sub-item', 
    sorNo: '', 
    description: 'Cement mortar 1 : 4 (1 cement : 4 coarse sand)', 
    unit: 'sqm', 
    rate: '703.00', 
    quantity: '0.00', 
    source: 'BSR' 
  },
  { id: 'row-19', type: 'filler', fillerColumn: 'DSR' },
  { 
    id: 'row-20', 
    type: 'sub-item', 
    slNo: '7.1', 
    sorNo: '6.21A', 
    description: 'Extra for providing and placing in position 2 Nos. 6mm dia MS bars at every 3rd course of half brick masonry (with FPS bricks)', 
    unit: 'sqm', 
    rate: '87.70', 
    quantity: '0.00', 
    source: 'BSR' 
  },
  { id: 'row-21', type: 'filler', fillerColumn: 'DSR' }
];

export const parseNum = (val: string | undefined): number => {
  if (!val) return 0;
  const parsed = parseFloat(val.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateRowAmount = (row: EstimateRow): number => {
  if (row.type !== 'item' && row.type !== 'sub-item') return 0;
  return parseNum(row.rate) * parseNum(row.quantity);
};
