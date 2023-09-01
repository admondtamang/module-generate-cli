# Email Module

## Required env variables

```
EMAIL_FROM=""
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

## Usae

- First you have to create a `.hbs` template in `/templates` directory with necessary placeholders i.e. `{{verificationCode}}` or any other name as per your requirement
- Then in `email.interface.ts` file on `EmailTemplate` type, append the newly created file name, i.e. if you created `forgot-password.hbs`, the new type should be 

```ts
export type EmailTemplate = "welcome" | "verify-email" | 'forgot-password';
```

- Now use `sendMail` function wherever you require

```ts
sendMail({
  to: "user@email.com",
  subject: "Email verification",
  template: "verify-email",
  context: {
    verificationCode: "", // populate the placeholder you placed in .hbs file
  },
});
```

## Important Note
- we have to copy hbs file as it won't happen during ts compilation step thus add this script on your `package.json`

```json
    "copy-hbs": "copyfiles -u 1 src/**/*.hbs dist"
```

- and modify your build script to

```json
    "build": "tsc && yarn copy-hbs",
```
