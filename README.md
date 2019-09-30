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

// SignUp
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

// SignIn
auth
  .signIn("john-doe@gmail.com", "myP@ssw0ord!")
  .then(userDatas => {
    console.log(userDatas);
  })
  .catch(error => {
    console.log(error);
  });

// SignOut
auth
  .signOut()
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

// Delete resource (need an active session)
auth
  .deleteResource()
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

// Change password
auth
  .changePassword("myP@ssw0ord!", "newp@SSw0rd", "newp@SSw0rd")
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

// Send reset password email
auth
  .resetPassword("john-doe@gmail.com", "www.url-after-reset.com")
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

// Update password after email reset
auth
  .updatePasswordByToken("jd97-MDsj763fsGSU", "www.url-after-update.com")
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
```
