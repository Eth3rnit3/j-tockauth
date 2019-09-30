# J-tockauth

A connector for javascript application frontend to Ruby on Rails with Devise Token Auth gem backend

# Usage

```jsx
import JtockAuth from "j-tockauth";

const auth = new JtockAuth({
  host: "http://127.0.0.1:3000",
  prefixUrl: "/api/v1",
  debug: false
});

export default auth;
```

## SignUp

```jsx
import auth from "./auth";

auth
  .signUp(
    {
      email: "john-doe@gmail.com",
      password: "myP@ssw0ord!",
      avatarUrl: "www.image.com/picture.jpg"
    },
    "www.url-after-confirmation.com"
  )
  .then(userDatas => {
    console.log(userDatas);
  })
  .catch(error => {
    console.log(error);
  });
```

## SignIn

```jsx
import auth from "./auth";

auth
  .signIn("john-doe@gmail.com", "myP@ssw0ord!")
  .then(userDatas => {
    console.log(userDatas);
  })
  .catch(error => {
    console.log(error);
  });
```

## SignOut (need an active session)

```jsx
import auth from "./auth";

auth
  .signOut()
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
```

## Delete resource (need an active session)

```jsx
import auth from "./auth";

auth
  .deleteResource()
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
```

## Change password

```jsx
import auth from "./auth";

auth
  .changePassword("myP@ssw0ord!", "newp@SSw0rd", "newp@SSw0rd")
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
```

## Send reset password link and token by email

```jsx
import auth from "./auth";

auth
  .resetPassword("john-doe@gmail.com", "www.reset-password-link.com")
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
```

## Update password after email reset

```jsx
import auth from "./auth";

auth
  .updatePasswordByToken(
    "jd97-MDsj763fsGSU",
    "www.url-after-reset-password-success.com"
  )
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
```
