
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript Sample Server Repository.

## Installation

```bash
$ npm install --save
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Chat
```bash
http://127.0.0.1:3000/chat
```

## GraphQL
```bash
http://127.0.0.1:3000/graphql

# mutation
mutation {
  createAccount(
    createAccountInput : {
      loginId: "name"
    }
  )
  {
    resultType
    info {
      loginId
      createdTime
      lastLoginTime
    }
  }
}

# query
query {
  getAccountInfo(loginId: "name") {
    resultType
    info {
      loginId
      createdTime
      lastLoginTime
    }
  }

  
  login(loginId: "name") {
    resultType
    info {
          loginId
    }
  }
  
  getAllAccountInfo {
    resultType
    infos {
      loginId
      createdTime
      lastLoginTime
    }
  }
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## License

Nest is [MIT licensed](LICENSE).
