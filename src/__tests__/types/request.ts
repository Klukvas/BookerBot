import supertest from "supertest"

export type TestRequest = {
    request:  supertest.SuperTest<supertest.Test>
}