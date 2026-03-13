#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CaStack } from '../lib/ca-stack';

const app = new cdk.App();
new CaStack(app, 'CaStack', {
  env: {
    account: '217870417075',
    region: 'eu-west-1',
  },
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: 'sewt1',
  }),
});