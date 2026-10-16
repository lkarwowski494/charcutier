/**
 * CHARCUTIER — BatchQrScanner Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { BatchQrScanner } from '../../src/components/BatchQrScanner';
import { TouchableOpacity } from 'react-native';

describe('BatchQrScanner component', () => {
  test('calls onClose when cancel button is clicked', () => {
    const onCloseMock = jest.fn();
    const onScanMock = jest.fn();

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <BatchQrScanner visible={true} onClose={onCloseMock} onScanBatchId={onScanMock} />
      );
    });

    const cancelBtn = tr.root.findAllByType(TouchableOpacity)[0];
    act(() => {
      cancelBtn.props.onPress();
    });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('handles barcode scanned with charcutier schema URL', () => {
    const onCloseMock = jest.fn();
    const onScanMock = jest.fn();

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <BatchQrScanner visible={true} onClose={onCloseMock} onScanBatchId={onScanMock} />
      );
    });

    const cameraView = tr.root.findAll((node: any) => node.props && node.props.barcodeScannerSettings)[0];
    expect(cameraView).toBeTruthy();

    act(() => {
      cameraView.props.onBarcodeScanned({ data: 'charcutier://batch/batch_dry_ham_01' });
    });

    expect(onScanMock).toHaveBeenCalledWith('batch_dry_ham_01');
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('handles barcode scanned with plain text batch ID', () => {
    const onCloseMock = jest.fn();
    const onScanMock = jest.fn();

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <BatchQrScanner visible={true} onClose={onCloseMock} onScanBatchId={onScanMock} />
      );
    });

    const cameraView = tr.root.findAll((node: any) => node.props && node.props.barcodeScannerSettings)[0];
    act(() => {
      cameraView.props.onBarcodeScanned({ data: 'batch_kielbasa_krakowska' });
    });

    expect(onScanMock).toHaveBeenCalledWith('batch_kielbasa_krakowska');
    expect(onCloseMock).toHaveBeenCalled();
  });
});
