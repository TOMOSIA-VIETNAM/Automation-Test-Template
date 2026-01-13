/**
 * Common messages for test validation
 * Supports English and Japanese languages
 */

export type Language = 'en' | 'ja';

export interface Message {
  id: string;
  en: string;
  ja: string;
}

// VALIDATION - Email
export const EMAIL_MESSAGES = {
  REQUIRED: {
    id: 'message_01',
    en: 'Please enter email address',
    ja: 'メールアドレスを入力してください',
  },
  INVALID: {
    id: 'message_02',
    en: 'Invalid email format',
    ja: 'メールアドレスの形式が正しくありません',
  },
  DUPLICATE: {
    id: 'message_03',
    en: 'This email address is already registered',
    ja: 'このメールアドレスは既に登録されています',
  },
} as const;

// VALIDATION - Name
export const NAME_MESSAGES = {
  FIRST_NAME_REQUIRED: {
    id: 'message_04',
    en: 'Please enter first name',
    ja: '名を入力してください',
  },
  LAST_NAME_REQUIRED: {
    id: 'message_05',
    en: 'Please enter last name',
    ja: '姓を入力してください',
  },
  FULL_NAME_REQUIRED: {
    id: 'message_06',
    en: 'Please enter full name',
    ja: '氏名を入力してください',
  },
  INVALID_NAME: {
    id: 'message_07',
    en: 'Please enter a valid name',
    ja: '有効な名前を入力してください',
  },
} as const;

// VALIDATION - Password
export const PASSWORD_MESSAGES = {
  REQUIRED: {
    id: 'message_08',
    en: 'Please enter password',
    ja: 'パスワードを入力してください',
  },
  INVALID: {
    id: 'message_09',
    en: 'Password must be at least 8 characters long',
    ja: 'パスワードは8文字以上である必要があります',
  },
  CONFIRM_REQUIRED: {
    id: 'message_10',
    en: 'Please re-enter password',
    ja: 'パスワードを再入力してください',
  },
  MISMATCH: {
    id: 'message_11',
    en: 'Passwords do not match',
    ja: 'パスワードが一致しません',
  },
  CURRENT_REQUIRED: {
    id: 'message_55',
    en: 'Current password is required',
    ja: '現在のパスワードは必須です',
  },
  NEW_REQUIRED: {
    id: 'message_56',
    en: 'New password is required',
    ja: '新しいパスワードは必須です',
  },
  LENGTH_CONSTRAINT: {
    id: 'message_57',
    en: 'Password length must be 6-30 characters',
    ja: 'パスワードの長さは6～30文字です',
  },
  CONFIRM_NEW_REQUIRED: {
    id: 'message_58',
    en: 'Please re-enter new password',
    ja: '新しいパスワードを再度入力してください',
  },
  CORRECT_NEW_REQUIRED: {
    id: 'message_59',
    en: 'Please enter correct new password',
    ja: '正しい新しいパスワードを入力してください',
  },
} as const;

// VALIDATION - Gender
export const GENDER_MESSAGES = {
  REQUIRED: {
    id: 'message_12',
    en: 'Please select gender',
    ja: '性別を選択してください',
  },
} as const;

// VALIDATION - Date of Birth
export const DOB_MESSAGES = {
  REQUIRED: {
    id: 'message_13',
    en: 'Please enter date of birth',
    ja: '生年月日を入力してください',
  },
  INVALID: {
    id: 'message_14',
    en: 'Invalid date of birth',
    ja: '不正な生年月日',
  },
} as const;

// VALIDATION - Address
export const ADDRESS_MESSAGES = {
  REQUIRED: {
    id: 'message_15',
    en: 'Please enter address',
    ja: '住所を入力してください',
  },
  INVALID: {
    id: 'message_16',
    en: 'Please enter a valid address',
    ja: '有効な住所を入力してください',
  },
} as const;

// VALIDATION - Postcode
export const POSTCODE_MESSAGES = {
  REQUIRED: {
    id: 'message_17',
    en: 'Please enter postcode',
    ja: '郵便番号を入力してください',
  },
  INVALID: {
    id: 'message_18',
    en: 'Invalid postcode',
    ja: '不正な郵便番号',
  },
} as const;

// VALIDATION - Phone
export const PHONE_MESSAGES = {
  REQUIRED: {
    id: 'message_19',
    en: 'Please enter phone number',
    ja: '電話番号を入力してください',
  },
  INVALID: {
    id: 'message_20',
    en: 'Invalid phone number',
    ja: '不正な電話番号',
  },
} as const;

// VALIDATION - Age
export const AGE_MESSAGES = {
  REQUIRED: {
    id: 'message_21',
    en: 'Please enter age',
    ja: '年齢を入力してください',
  },
  MUST_BE_NUMBER: {
    id: 'message_22',
    en: 'Please enter a number',
    ja: '数値を入力してください',
  },
  REASONABLE_VALUE: {
    id: 'message_23',
    en: 'Please enter a reasonable value',
    ja: '合理的な値を入力してください',
  },
} as const;

// VALIDATION - ISBN
export const ISBN_MESSAGES = {
  REQUIRED: {
    id: 'message_24',
    en: 'Please enter book ISBN',
    ja: '書籍のISBNを入力してください',
  },
  INVALID: {
    id: 'message_25',
    en: 'Invalid ISBN',
    ja: '不正なISBN',
  },
} as const;

// VALIDATION - Number Fields
export const NUMBER_MESSAGES = {
  REQUIRED: {
    id: 'message_26',
    en: 'Please enter a number',
    ja: '数値を入力してください',
  },
  GREATER_THAN_ZERO: {
    id: 'message_27',
    en: 'Please enter a value greater than 0',
    ja: '0より大きい数値を入力してください',
  },
  NOT_EMPTY: {
    id: 'message_51',
    en: 'This field cannot be empty',
    ja: 'この欄は空にできません',
  },
} as const;

// AUTHENTICATION
export const AUTH_MESSAGES = {
  INCORRECT_CREDENTIALS: {
    id: 'message_28',
    en: 'Incorrect email or password',
    ja: 'メールアドレスまたはパスワードが間違っています',
  },
  ACCOUNT_DISABLED: {
    id: 'message_29',
    en: 'This account is currently disabled. Please contact administrator',
    ja: 'このアカウントは現在無効です。管理者にお問い合わせください。',
  },
  EMAIL_REQUIRED: {
    id: 'message_52',
    en: 'Please enter email address',
    ja: 'メールアドレスを入力してください',
  },
  PASSWORD_REQUIRED: {
    id: 'message_53',
    en: 'Please enter password',
    ja: 'パスワードを入力してください',
  },
  LOGIN_SUCCESS: {
    id: 'message_54',
    en: 'Login successful',
    ja: 'ログインに成功しました',
  },
} as const;

// BORROW/RETURN Operations
export const BORROW_RETURN_MESSAGES = {
  USER_NOT_EXIST: {
    id: 'message_30',
    en: 'User does not exist',
    ja: 'ユーザーが存在しません',
  },
  BOOK_NOT_EXIST: {
    id: 'message_31',
    en: 'Book does not exist',
    ja: '本は存在しません',
  },
  INSUFFICIENT_QUANTITY: {
    id: 'message_32',
    en: 'Insufficient quantity of the book',
    ja: '本の在庫が不足しています',
  },
  INSUFFICIENT_CREDIT: {
    id: 'message_33',
    en: 'Not enough credit on the account',
    ja: 'アカウントのクレジットが不足しています',
  },
  BORROW_FAILED: {
    id: 'message_34',
    en: 'Borrow failed, please contact the administrator',
    ja: '貸出に失敗しました。管理者にお問い合わせください',
  },
  RETURN_FAILED: {
    id: 'message_35',
    en: 'Return failed, please contact the administrator',
    ja: '返却に失敗しました。管理者にお問い合わせください',
  },
  ILLEGAL_OPERATION: {
    id: 'message_36',
    en: 'Illegal Operation',
    ja: '不正な操作です',
  },
} as const;

// SYSTEM
export const SYSTEM_MESSAGES = {
  DELETE_FAILED: {
    id: 'message_37',
    en: 'Deletion failed, please contact the administrator',
    ja: '削除に失敗しました。管理者にお問い合わせください',
  },
  SYSTEM_FAILURE: {
    id: 'message_38',
    en: 'System failure',
    ja: 'システムエラーが発生しました',
  },
  SUBMIT_SUCCESS: {
    id: 'message_39',
    en: 'Submitted successfully',
    ja: '送信されました',
  },
  UPDATE_SUCCESS: {
    id: 'message_61',
    en: 'Updated successfully',
    ja: '更新されました',
  },
  DELETE_SUCCESS: {
    id: 'message_62',
    en: 'Deleted successfully',
    ja: '削除されました',
  },
} as const;

// VALIDATION - Book
export const BOOK_MESSAGES = {
  NAME_REQUIRED: {
    id: 'message_40',
    en: 'Book name is required',
    ja: '書名を入力してください',
  },
  CATEGORY_REQUIRED_ADD: {
    id: 'message_41',
    en: 'Category is required (Add)',
    ja: 'カテゴリーを選択してください',
  },
  CATEGORY_REQUIRED_EDIT: {
    id: 'message_42',
    en: 'Category is required (Edit)',
    ja: 'カテゴリーを入力してください',
  },
  AUTHOR_REQUIRED: {
    id: 'message_43',
    en: 'Author is required',
    ja: '著者名を入力してください',
  },
  PUBLISHER_REQUIRED: {
    id: 'message_44',
    en: 'Publisher is required',
    ja: '出版社名を入力してください',
  },
  DATE_REQUIRED: {
    id: 'message_45',
    en: 'Please select a date',
    ja: '日付を選択してください',
  },
  CREDIT_REQUIRED: {
    id: 'message_46',
    en: 'Credit is required',
    ja: 'クレジットを入力してください',
  },
} as const;

// VALIDATION - Category
export const CATEGORY_MESSAGES = {
  NAME_REQUIRED: {
    id: 'message_47',
    en: 'Category name is required',
    ja: 'カテゴリー名は必須です',
  },
  REMARK_REQUIRED: {
    id: 'message_48',
    en: 'Remark is required',
    ja: '備考は必須です',
  },
} as const;

// All messages combined
export const MESSAGES = {
  EMAIL: EMAIL_MESSAGES,
  NAME: NAME_MESSAGES,
  PASSWORD: PASSWORD_MESSAGES,
  GENDER: GENDER_MESSAGES,
  DOB: DOB_MESSAGES,
  ADDRESS: ADDRESS_MESSAGES,
  POSTCODE: POSTCODE_MESSAGES,
  PHONE: PHONE_MESSAGES,
  AGE: AGE_MESSAGES,
  ISBN: ISBN_MESSAGES,
  NUMBER: NUMBER_MESSAGES,
  AUTH: AUTH_MESSAGES,
  BORROW_RETURN: BORROW_RETURN_MESSAGES,
  SYSTEM: SYSTEM_MESSAGES,
  BOOK: BOOK_MESSAGES,
  CATEGORY: CATEGORY_MESSAGES,
} as const;

/**
 * Helper function to get message in specific language
 * @param message - Message object
 * @param lang - Language code ('en' or 'ja')
 * @returns Message text in specified language
 */
export function getMessage(message: Message, lang: Language = 'en'): string {
  return message[lang];
}

/**
 * Helper function to get message by ID
 * @param messageId - Message ID (e.g., 'message_01')
 * @returns Message object if found, undefined otherwise
 */
export function getMessageById(messageId: string): Message | undefined {
  for (const category of Object.values(MESSAGES)) {
    for (const msg of Object.values(category)) {
      if (msg.id === messageId) {
        return msg as Message;
      }
    }
  }
  return undefined;
}
