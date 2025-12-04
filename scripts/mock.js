const mockBlogCards = () => new Promise((resolve) => {
  const mockedCards = [
    {
      image: './media_1537406cf4102e19dd4ae5e597e5449da88241a80.jpg',
      title: 'UnipolMove: la soluzione per una mobilità serena e sicura',
      durationIcon: 'un-icon-newspaper',
      durationText: '5 min read',
      tagLabel: 'Esplorare in serenità',
      tagCategory: 'mobility',
      tagType: 'secondary',
    },
    {
      image: './media_166d35f6d8f8e6c33f7251cbd4e137c2198cfb3ad.jpg',
      title: 'Come proteggere la casa dal caldo in estate',
      durationIcon: 'un-icon-play-circle',
      durationText: '10 min watch',
      tagLabel: 'Il tuo luogo sicuro',
      tagCategory: 'welfare',
      tagType: 'default',
    },
    {
      image: './media_156a2147f1f64148200276e2a342b11a8479e87ba.jpg',
      title: 'Dalla partenza all’arrivo, la sicurezza di un’assicurazione che ti segue ovunque',
      durationIcon: 'un-icon-headphones',
      durationText: '15 min listen',
      tagLabel: 'Esplorare in serenità',
      tagCategory: 'property',
      tagType: 'custom',
    },
    {
      image: './media_1a49929ed153c7e4c9267107cfa318e2a0e5f7d74.png',
      title: 'Sample Title 4',
      durationIcon: 'un-icon-newspaper',
      durationText: '8 min read',
      tagLabel: 'Article',
      tagCategory: 'mobility',
      tagType: 'secondary',
    },
    {
      image: './media_1a49929ed153c7e4c9267107cfa318e2a0e5f7d74.png',
      title: 'Sample Title 5',
      durationIcon: 'un-icon-play-circle',
      durationText: '10 min watch',
      tagLabel: 'Video',
      tagCategory: 'welfare',
      tagType: 'default',
    },
  ];
  resolve(mockedCards);
});
export default mockBlogCards;
