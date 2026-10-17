import { Alert } from 'react-native';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
}

const FORBIDDEN_LABELS = new Set([
  'nie',
  'tak',
  'wróć',
  'wroc',
  'no',
  'yes',
  'back',
]);

/**
 * Validates confirm dialog button labels according to NFR-INT-005.
 * Prohibits ambiguous labels ("Tak", "Nie", "Wróć").
 */
export function validateConfirmLabel(label: string): void {
  const normalized = label.trim().toLowerCase();
  if (FORBIDDEN_LABELS.has(normalized)) {
    throw new Error(
      `[NFR-INT-005] Label "${label}" is ambiguous and forbidden in confirm dialogs. Use explicit verbs like "Usuń", "Porzuć", "Anuluj".`
    );
  }
}

/**
 * Standard confirmation dialog adhering to S5 interaction guard.
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  const cancelText = options.cancelText || 'Anuluj';
  validateConfirmLabel(options.confirmText);
  if (options.cancelText) {
    validateConfirmLabel(options.cancelText);
  }

  return new Promise<boolean>((resolve) => {
    Alert.alert(
      options.title,
      options.message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: options.confirmText,
          style: options.destructive ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
