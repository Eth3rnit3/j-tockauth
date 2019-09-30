# J-tockauth

# Usage

```jsx
import JtockAuth from "j-tockauth";

const auth = new JtockAuth({
  host: "http://127.0.0.1:3000",
  prefixUrl: "/api/v1",
  debug: false
});

// SignIn
auth
  .signIn("john-doe@gmail.com", "myP@ssw0ord!")
  .then(userDatas => {
    console.log("FROM COMP", userDatas);
  })
  .catch(error => {
    console.log(error);
  });

// SignOut
auth
  .signOut()
  .then(response => {
    console.log("SING OUT", response);
  })
  .catch(error => {
    console.log(error);
  });
```
