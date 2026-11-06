import featureReducer, {
  toggleFeature,
  setFeature,
  resetFeatures,
  defaultFeatures,
} from './featureSlice';

describe('Feature Toggle Management Slice', () => {
  it('toggles feature state correctly and sets hasUnsavedChanges', () => {
    const initialState = {
      features: defaultFeatures,
      hasUnsavedChanges: false,
    };
    const nextState = featureReducer(initialState, toggleFeature('threeDSheenCanvas'));
    expect(nextState.features.threeDSheenCanvas).toBe(!defaultFeatures.threeDSheenCanvas);
    expect(nextState.hasUnsavedChanges).toBe(true);
  });

  it('sets explicit feature state and resets features', () => {
    const initialState = {
      features: defaultFeatures,
      hasUnsavedChanges: false,
    };
    const modified = featureReducer(
      initialState,
      setFeature({ key: 'maintenanceMode', value: true })
    );
    expect(modified.features.maintenanceMode).toBe(true);

    const reset = featureReducer(modified, resetFeatures());
    expect(reset.features.maintenanceMode).toBe(defaultFeatures.maintenanceMode);
    expect(reset.hasUnsavedChanges).toBe(false);
  });
});
