/**
 * @format
 */

import 'react-native';
import React from '../../../Library/Caches/typescript/2.9/node_modules/@types/react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from '../../../Library/Caches/typescript/2.9/node_modules/@types/react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
