## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript Sample Server Repository.

## Installation

```bash
$ npm install -g yarn

$ yarn
```

## Running the app

```bash
# development
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

```bash
docker pull redis:6.0

docker run -d --name redis-container -p 6379:6379 redis:6.0

docker pull mariadb:10.4.24

docker run -d --name mariadb-container -p 3306:3306 -e MYSQL_ROOT_PASSWORD=test1234 mariadb:10.4.24

docker exec -it mariadb-container mysql -u root -p

apt-get update
apt-get install vim

// edit my.cnf
vi /etc/mysql/my.cnf

lower_case_table_names=2

// docker restart
docker restart mariadb-container
```

## DB Init
```bash
// change synchronize : true
src/config/env/globalConfig.ts 

// 1. start server

// 2. stop server

// 3. change synchronize : false
```


## Chat

```bash
http://127.0.0.1:3000/chat
```

## GraphQL

```bash
http://127.0.0.1:3000/graphql

# mutation sample
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

# query sample
query {
    auth(id: "name") {
        resultType
        info {
            accountId
            loginId
            createdTime
            lastLoginTime
        }
        token
    }
}

  
query {
    login(accountId: number) {
    resultType
    info {
        accountId
        loginId
        createdTime
        lastLoginTime
      }
    }
}
  
query {
    getAccountInfo(accountId: number) {
    resultType
    info {
        loginId
        createdTime
        lastLoginTime
      }
    }
}

query { 
    getAllAccountInfo {
        resultType
        infos {
            loginId
            createdTime
            lastLoginTime
        }
    }
}

query {
  getPlayerInfo(accountId: number) {
  	resultType
  	info {
		accountId
		nick
		createdTime
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
