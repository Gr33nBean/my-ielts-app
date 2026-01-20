# Database Schema (Google Sheets)

## 1. Sheet: `users`

| Column | Name       | Type   | Description  |
| :----- | :--------- | :----- | :----------- | ------ |
| A (0)  | `email`    | String | Primary Key  |
| B (1)  | `fullName` | String | Display Name |
| C (2)  | `role`     | String | admin        | member |

## 2. Sheet: `topics`

| Column | Name          | Type   | Description    |
| :----- | :------------ | :----- | :------------- |
| A (0)  | `topicId`     | String | Unique ID      |
| B (1)  | `topicName`   | String | Title          |
| C (2)  | `category`    | String | IELTS category |
| D (3)  | `description` | String | Requirements   |

## 3. Sheet: `assignments`

| Column | Name            | Type   | Description                      |
| :----- | :-------------- | :----- | :------------------------------- |
| A (0)  | `assignmentId`  | String | Unique ID                        |
| B (1)  | `userEmail`     | String | FK to users                      |
| C (2)  | `topicId`       | String | FK to topics                     |
| D (3)  | `pairWithEmail` | String | Partner emails (comma separated) |
| E (4)  | `startDate`     | Date   | Start                            |
| F (5)  | `endDate`       | Date   | End                              |

## 4. Sheet: `vocabularies` (Dành cho Category: Vocabulary)

| Column | Name                | Type        | Description           |
| :----- | :------------------ | :---------- | :-------------------- |
| A (0)  | `vocabId`           | String      | Unique ID             |
| B (1)  | `assignmentId`      | String      | Related Assignment ID |
| C (2)  | `userEmail`         | String      | Submitter Email       |
| D (3)  | `word`              | String      | Vocabulary Word       |
| E (4)  | `ipa`               | String      | IPA Pronunciation     |
| F (5)  | `englishMeaning`    | String      | English Definition    |
| G (6)  | `vietnameseMeaning` | String      | Vietnamese Definition |
| H (7)  | `exampleSentence`   | String/Text | Example Sentence      |
| I (8)  | `collocationIdiom`  | String/Text | Collocations/Idioms   |
| J (9)  | `createdAt`         | DateTime    | Submission Timestamp  |

## 5. Sheet: `speaking` (Dành cho Category: Speaking)

| Column | Name           | Type     | Description         |
| :----- | :------------- | :------- | :------------------ |
| A (0)  | `submissionId` | String   | Unique ID           |
| B (1)  | `assignmentId` | String   | FK to assignments   |
| C (2)  | `userEmail`    | String   | Submitter           |
| D (3)  | `audioLink`    | String   | Drive/Cloud link    |
| E (4)  | `transcript`   | Text     | Optional transcript |
| F (5)  | `createdAt`    | DateTime | Timestamp           |

## 6. Sheet: `writing` (Dành cho Category: Writing)

| Column | Name           | Type     | Description       |
| :----- | :------------- | :------- | :---------------- |
| A (0)  | `submissionId` | String   | Unique ID         |
| B (1)  | `assignmentId` | String   | FK to assignments |
| C (2)  | `userEmail`    | String   | Submitter         |
| D (3)  | `essayContent` | Text     | The essay text    |
| E (4)  | `wordCount`    | Number   |                   |
| F (5)  | `createdAt`    | DateTime | Timestamp         |

## 7. Sheet: `reading` (Dành cho Category: Reading)

| Column | Name             | Type     | Description            |
| :----- | :--------------- | :------- | :--------------------- |
| A (0)  | `submissionId`   | String   | Unique ID              |
| B (1)  | `assignmentId`   | String   | FK to assignments      |
| C (2)  | `userEmail`      | String   | Submitter              |
| D (3)  | `translatedText` | Text     | Vietnamese translation |
| E (4)  | `vocabList`      | Text     | Key vocabs found       |
| F (5)  | `createdAt`      | DateTime | Timestamp              |

## 8. Sheet: `listening` (Dành cho Category: Listening)

| Column | Name             | Type     | Description            |
| :----- | :--------------- | :------- | :--------------------- |
| A (0)  | `submissionId`   | String   | Unique ID              |
| B (1)  | `assignmentId`   | String   | FK to assignments      |
| C (2)  | `userEmail`      | String   | Submitter              |
| D (3)  | `translatedText` | Text     | Vietnamese translation |
| E (4)  | `vocabList`      | Text     | Key vocabs found       |
| F (5)  | `createdAt`      | DateTime | Timestamp              |

## 9. Sheet: `grammar` (Dành cho Category: Grammar)

| Column | Name           | Type     | Description       |
| :----- | :------------- | :------- | :---------------- |
| A (0)  | `submissionId` | String   | Unique ID         |
| B (1)  | `assignmentId` | String   | FK to assignments |
| C (2)  | `userEmail`    | String   | Submitter         |
| D (3)  | `notes`        | Text     | Completion notes  |
| E (4)  | `createdAt`    | DateTime | Timestamp         |
