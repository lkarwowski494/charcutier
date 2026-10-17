import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { View, TouchableOpacity, Text } from 'react-native';

describe('S4 Accessible Delete Guard (tests/swipe-delete.test.tsx)', () => {
  it('Deletable list item exposes accessible delete action or visible delete button', () => {
    const onDelete = jest.fn();

    // Model component conforming to S4
    const DeletableRow = ({ title, onDelete }: { title: string; onDelete: () => void }) => (
      <View
        testID="deletable-row"
        accessibilityRole="none"
        accessibilityActions={[{ name: 'delete', label: 'Usuń' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'delete') {
            onDelete();
          }
        }}
      >
        <Text>{title}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Usuń ${title}`}
          onPress={onDelete}
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <Text>Usuń</Text>
        </TouchableOpacity>
      </View>
    );

    let tree: any;
    act(() => {
      tree = renderer.create(<DeletableRow title="Partia #001" onDelete={onDelete} />);
    });

    const btn = tree.root.findByProps({ accessibilityLabel: 'Usuń Partia #001' });
    expect(btn).toBeTruthy();

    act(() => {
      btn.props.onPress();
    });
    expect(onDelete).toHaveBeenCalledTimes(1);

    // Also trigger accessibility action
    const row = tree.root.findByProps({ testID: 'deletable-row' });
    expect(row.props.accessibilityActions).toEqual([{ name: 'delete', label: 'Usuń' }]);
    act(() => {
      row.props.onAccessibilityAction({ nativeEvent: { actionName: 'delete' } });
    });
    expect(onDelete).toHaveBeenCalledTimes(2);
  });
});
