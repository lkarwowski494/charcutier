import { confirm, validateConfirmLabel } from '../../src/lib/confirm';
import { Alert } from 'react-native';

describe('confirm helper & NFR-INT-005 label rules', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      // simulate pressing confirm (second button)
      if (buttons && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
    });
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('rejects forbidden ambiguous labels ("Tak", "Nie", "Wróć", "Yes", "No", "Back")', () => {
    expect(() => validateConfirmLabel('Tak')).toThrow(/ambiguous and forbidden/);
    expect(() => validateConfirmLabel('Nie')).toThrow(/ambiguous and forbidden/);
    expect(() => validateConfirmLabel('Wróć')).toThrow(/ambiguous and forbidden/);
    expect(() => validateConfirmLabel('wroc')).toThrow(/ambiguous and forbidden/);
    expect(() => validateConfirmLabel('Yes')).toThrow(/ambiguous and forbidden/);
    expect(() => validateConfirmLabel('No')).toThrow(/ambiguous and forbidden/);
    expect(() => validateConfirmLabel('Back')).toThrow(/ambiguous and forbidden/);
  });

  it('allows descriptive action verbs ("Usuń", "Porzuć zmiany", "Wyczyść")', () => {
    expect(() => validateConfirmLabel('Usuń')).not.toThrow();
    expect(() => validateConfirmLabel('Porzuć zmiany')).not.toThrow();
    expect(() => validateConfirmLabel('Wyczyść dane')).not.toThrow();
  });

  it('invokes Alert.alert with cancel button and destructive button', async () => {
    const res = await confirm({
      title: 'Usunąć partię?',
      message: 'Ta operacja jest nieodwracalna.',
      confirmText: 'Usuń',
      destructive: true,
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Usunąć partię?',
      'Ta operacja jest nieodwracalna.',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Anuluj', style: 'cancel' }),
        expect.objectContaining({ text: 'Usuń', style: 'destructive' }),
      ]),
      expect.any(Object)
    );
    expect(res).toBe(true);
  });
});
