export interface PincodeResult {
  pincode: string;
  serviceable: boolean;
  city: string;
  state: string;
  codAvailable: boolean;
  estimatedDays: number;
}

const postalDirectory: Record<string, { city: string; state: string; days: number; cod: boolean }> = {
  // Odisha Weaving Clusters & Cities
  '754035': { city: 'Nuapatna / Cuttack', state: 'Odisha', days: 2, cod: true },
  '751001': { city: 'Bhubaneswar', state: 'Odisha', days: 2, cod: true },
  '751024': { city: 'Bhubaneswar (Patia)', state: 'Odisha', days: 2, cod: true },
  '753001': { city: 'Cuttack', state: 'Odisha', days: 2, cod: true },
  '752001': { city: 'Puri', state: 'Odisha', days: 2, cod: true },
  '768028': { city: 'Bargarh (Ikat Cluster)', state: 'Odisha', days: 2, cod: true },
  '767017': { city: 'Sonepur (Subarnapur)', state: 'Odisha', days: 2, cod: true },
  '760001': { city: 'Berhampur (Silk City)', state: 'Odisha', days: 2, cod: true },
  '764020': { city: 'Kotpad (Tribal Weaves)', state: 'Odisha', days: 3, cod: true },

  // Indian Metros
  '110001': { city: 'New Delhi', state: 'Delhi', days: 4, cod: true },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 4, cod: true },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 4, cod: true },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 4, cod: true },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3, cod: true },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 4, cod: true },
};

export const checkPincodeServiceability = (pincode: string): PincodeResult => {
  const clean = (pincode || '').trim();

  if (postalDirectory[clean]) {
    const entry = postalDirectory[clean];
    return {
      pincode: clean,
      serviceable: true,
      city: entry.city,
      state: entry.state,
      codAvailable: entry.cod,
      estimatedDays: entry.days,
    };
  }

  // Fallback heuristic for any valid 6-digit Indian pincode
  if (/^[1-9][0-9]{5}$/.test(clean)) {
    const isOdisha = clean.startsWith('75') || clean.startsWith('76');
    return {
      pincode: clean,
      serviceable: true,
      city: isOdisha ? 'Odisha District' : 'Regional City',
      state: isOdisha ? 'Odisha' : 'India',
      codAvailable: true,
      estimatedDays: isOdisha ? 3 : 5,
    };
  }

  return {
    pincode: clean,
    serviceable: false,
    city: '',
    state: '',
    codAvailable: false,
    estimatedDays: 0,
  };
};
