// META: title=Buckets API: Tests for the StorageBucket object.
// META: global=window,worker

'use strict';

// This test is for the initial version of the StorageBucket object for
// debugging.
//
// TODO(ayui): Split and add extensive testing for each endpoint after endpoints
// are fully implemented.
promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate(
      'bucket_name', { persisted: true });
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });
  const persisted = await bucket.persisted();
  assert_true(persisted);
}, 'persisted() should retrieve bucket persisted state');

promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name');
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });
  const persisted = await bucket.persisted();
  assert_false(persisted);
}, 'persisted() should be defaulted to false');

// TODO(ayui): This tests temporary behavior and should be removed when fully
// implemented. persist() should request for bucket persistance but not
// guarantee it.
promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name');
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });
  let persisted = await bucket.persisted();
  assert_false(persisted);

  if (self.GLOBAL.isWindow()) {
    await bucket.persist();

    persisted = await bucket.persisted();
    assert_true(persisted);
  } else {
    assert_equals(bucket.persist, undefined);
  }
}, 'persist() should request persistance for bucket on Window');

// TODO(ayui): This tests temporary behavior and should be removed when fully
// implemented. estimate() should return actual usage metrics but currently does
// not.
promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name');
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });
  const usage = await bucket.estimate();
  assert_equals(usage, undefined);
}, 'estimate() should retrieve quota usage');

promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name');
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });

  const durability = await bucket.durability();
  assert_equals("relaxed", durability)
}, 'durability() should retrieve bucket durability defaulted to "relaxed"');

promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate(
      'bucket_name', { durability: "strict" });
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });

  const durability = await bucket.durability();
  assert_equals("strict", durability)
}, 'durability() should retrieve bucket durability specified during creation');

promise_test(async testCase => {
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  const expiresDate = Date.now() + oneYear;
  const bucket = await navigator.storageBuckets.openOrCreate(
      'bucket_name', { expires: expiresDate });
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });

  const expires = await bucket.expires();
  assert_equals(expires, expiresDate);
}, 'expires() should retrieve expires date');

promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name');
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });

  const expires = await bucket.expires();
  assert_equals(expires, undefined);
}, 'expires() should be defaulted to null');

promise_test(async testCase => {
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name');
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });

  const oneYear = 365 * 24 * 60 * 60 * 1000;
  const expiresDate = Date.now() + oneYear;
  bucket.setExpires(expiresDate);

  const expires = await bucket.expires();
  assert_equals(expires, expiresDate);
}, 'setExpires() should set bucket expires date');

promise_test(async testCase => {
  const oneDay = 24 * 60 * 60 * 1000;
  const expiresDate = Date.now() + oneDay;
  const bucket = await navigator.storageBuckets.openOrCreate('bucket_name', {
    expires: expiresDate
  });
  testCase.add_cleanup(async () => {
    await navigator.storageBuckets.delete('bucket_name');
  });
  let expires = await bucket.expires();
  assert_equals(expires, expiresDate);

  const oneYear = 365 * oneDay;
  const newExpiresDate = Date.now() + oneYear;
  bucket.setExpires(newExpiresDate);

  expires = await bucket.expires();
  assert_equals(expires, newExpiresDate);
}, 'setExpires() should update expires date');
