class TestUtils {
  generateRandomEmail() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let emailPrefix = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      emailPrefix += characters[randomIndex];
    }

    const domains = ['example.com', 'test.com', 'mail.com', 'demo.com', 'gmail.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    return `${emailPrefix}@${randomDomain}`;
  }
}

export default new TestUtils();
