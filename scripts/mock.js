const mockBlogCards = () => new Promise((resolve) => {
  const mockedCards = [
    {
      image: './media_1a49929ed153c7e4c9267107cfa318e2a0e5f7d74.png',
      title: 'Sample Title 1',
      durationIcon: 'un-icon-newspaper',
      durationText: '5 min read',
      tagLabel: 'News',
      tagCategory: 'mobility',
      tagType: 'secondary',
    },
    {
      image: './media_1a49929ed153c7e4c9267107cfa318e2a0e5f7d74.png',
      title: 'Sample Title 2',
      durationIcon: 'un-icon-play-circle',
      durationText: '10 min watch',
      tagLabel: 'Video',
      tagCategory: 'welfare',
      tagType: 'default',
    },
    {
      image: './media_1a49929ed153c7e4c9267107cfa318e2a0e5f7d74.png',
      title: 'Sample Title 3',
      durationIcon: 'un-icon-headphones',
      durationText: '15 min listen',
      tagLabel: 'Podcast',
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
