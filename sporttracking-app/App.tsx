import React from 'react';
import {RegisterForm} from "./components/RegisterForm";
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

export default function App() {
  return (
      <ApplicationProvider {...eva} theme={eva.light}>
          <RegisterForm/>
      </ApplicationProvider>
  );
}
