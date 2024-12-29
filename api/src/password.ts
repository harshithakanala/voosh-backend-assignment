import bcrypt from 'bcryptjs';

const testPassword = 'test2@123'; // The plaintext password to test

// Hash the test password with salt rounds (10 is the recommended value)
bcrypt.hash(testPassword, 10, (err: Error | null, hashedPassword: string) => {
  if (err) {
    console.error('Error while hashing:', err);
  } else {
    // The hashedPassword is what you'd store in your database
    console.log('Generated Hash:', hashedPassword);

    // Now you can compare the hash you generated with the user-provided password
    bcrypt.compare(testPassword, hashedPassword, (compareErr, compareRes) => {
      if (compareErr) {
        console.log('Error:', compareErr);
      } else {
        console.log('Password valid:', compareRes); // This should print true now
      }
    });
  }
});
