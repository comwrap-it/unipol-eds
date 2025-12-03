const mockBlogCards = () => new Promise((resolve) => {
  const mockedCards = [
    {
      image: 'https://picsum.photos/seed/blog1/300/200',
      title: 'Sample Title 1',
      durationIcon: 'un-icon-newspaper',
      durationText: '5 min read',
      tagLabel: 'News',
      tagCategory: 'mobility',
      tagType: 'secondary',
    },
    {
      image: 'https://picsum.photos/seed/blog2/300/200',
      title: 'Sample Title 2',
      durationIcon: 'un-icon-play-circle',
      durationText: '10 min watch',
      tagLabel: 'Video',
      tagCategory: 'welfare',
      tagType: 'default',
    },
    {
      image: 'https://picsum.photos/seed/blog3/300/200',
      title: 'Sample Title 3',
      durationIcon: 'un-icon-headphones',
      durationText: '15 min listen',
      tagLabel: 'Podcast',
      tagCategory: 'property',
      tagType: 'custom',
    },
    {
      image: 'https://picsum.photos/seed/blog4/300/200',
      title: 'Sample Title 4',
      durationIcon: 'un-icon-newspaper',
      durationText: '8 min read',
      tagLabel: 'Article',
      tagCategory: 'mobility',
      tagType: 'secondary',
    },
    {
      image: 'https://picsum.photos/seed/blog5/300/200',
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
