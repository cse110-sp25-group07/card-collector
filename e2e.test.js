describe('Index.html Page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000'); // or your live site path
  });

  it('has the correct title', async () => {
    const title = await page.title();
    expect(title).toBe('My Card Collection');
  });

  it('displays the main heading', async () => {
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toMatch(/My Pokémon Cards/);
  });

  it('renders exactly 3 card elements', async () => {
    const cards = await page.$$('.card');
    expect(cards.length).toBe(3);
  });

  it('each card contains an image, name, and HP', async () => {
    const cardInfo = await page.$$eval('.card', cards =>
      cards.map(card => {
        const img = card.querySelector('img');
        const name = card.querySelector('.card-name');
        const hp = card.querySelector('.card-hp');
        return {
          hasImage: !!img?.src,
          hasName: !!name?.textContent,
          hasHP: !!hp?.textContent
        };
      })
    );

    for (const card of cardInfo) {
      expect(card.hasImage).toBe(true);
      expect(card.hasName).toBe(true);
      expect(card.hasHP).toBe(true);
    }
  });
});