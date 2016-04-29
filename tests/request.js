import Request  from '../source/request.js';
import Client   from '../source/client.js';
import Response from '../source/response.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

chai.use(sinonChai);

describe("Request", () => {
  it("should export a Request object", () => {
    expect(Request).to.not.be.null;
    expect(Request.name).to.equal("Request");
  });

  describe(".accountBalance", () => {
    it("should call the client and pass a validator", () => {
      let response = new Response();
      let client   = new Client().instance();
      let request  = new Request();

      request.setClient(client);

      let spy = sinon.spy(client, "checkBalance");

      request.accountBalance();
      expect(spy).to.be.called;
    });
  });
});
