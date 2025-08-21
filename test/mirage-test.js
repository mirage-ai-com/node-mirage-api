/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var Mirage = require("../dist/mirage").Mirage;
var assert = require("assert");


describe("node-mirage-api", function() {
  describe("constructor", function() {
    it("should succeed creating an instance with valid options", function() {
      assert.doesNotThrow(
        function() {
          new Mirage("dummy_user_id", "dummy_secret_key");
        },

        "Mirage should not throw on valid options"
      );
    });

    it("should fail creating an instance with missing secret_key", function() {
      assert.throws(
        function() {
          new Mirage("dummy_user_id");
        },

        "Mirage should throw on missing secret_key"
      );
    });

    it("should fail creating an instance with empty user_id", function() {
      assert.throws(
        function() {
          new Mirage("", "dummy_secret_key");
        },

        "Mirage should throw on missing user_id"
      );
    });
  });
});
