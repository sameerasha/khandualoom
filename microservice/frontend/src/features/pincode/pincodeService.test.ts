import { checkPincodeServiceability } from './pincodeService';

describe('Pincode Serviceability & Delivery ETA', () => {
  it('identifies Odisha weaving cluster with fast delivery', () => {
    const result = checkPincodeServiceability('754035'); // Nuapatna
    expect(result.serviceable).toBe(true);
    expect(result.city).toBe('Nuapatna / Cuttack');
    expect(result.state).toBe('Odisha');
    expect(result.codAvailable).toBe(true);
    expect(result.estimatedDays).toBe(2);
  });

  it('identifies national metros with standard insured transit', () => {
    const result = checkPincodeServiceability('110001'); // Delhi
    expect(result.serviceable).toBe(true);
    expect(result.city).toBe('New Delhi');
    expect(result.state).toBe('Delhi');
    expect(result.estimatedDays).toBe(4);
  });
});
