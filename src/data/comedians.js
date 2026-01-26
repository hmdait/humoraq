// src/data/comedians.js
// Database of famous comedians with biographical content

export const comedians = [
  {
    id: 'eddie-murphy',
    name: 'Eddie Murphy',
    slug: 'eddie-murphy',
    birthYear: 1961,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    shortBio: 'Stand-up legend and SNL icon',
    bio: `Eddie Murphy is an American actor, comedian, and singer who rose to fame on Saturday Night Live in the early 1980s. Known for his energetic and versatile performances, Murphy became one of the most successful comedians and actors of his generation.

Born in Brooklyn, New York, Murphy began his career doing stand-up comedy as a teenager. His breakthrough came when he joined SNL at age 19, where his characters and impressions became instant classics.

Murphy's film career includes iconic roles in "48 Hrs.", "Trading Places", "Beverly Hills Cop", "Coming to America", "The Nutty Professor", and the "Shrek" franchise. His comedy specials "Delirious" (1983) and "Raw" (1987) are considered among the greatest stand-up performances ever recorded.`,
    famousWorks: [
      'Saturday Night Live (1980-1984)',
      'Beverly Hills Cop series',
      'Coming to America',
      'The Nutty Professor',
      'Shrek franchise',
      'Delirious (1983)',
      'Raw (1987)'
    ],
    style: 'Energetic, character-driven, observational comedy with sharp impressions',
    achievements: [
      'Golden Globe Award winner',
      'Emmy Award winner',
      'Mark Twain Prize for American Humor (2015)',
      'Hollywood Walk of Fame star',
      'One of highest-grossing actors of all time'
    ]
  },
  {
    id: 'charlie-chaplin',
    name: 'Charlie Chaplin',
    slug: 'charlie-chaplin',
    birthYear: 1889,
    nationality: 'British',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    shortBio: 'Silent film pioneer and The Tramp',
    bio: `Sir Charles Spencer Chaplin was an English comic actor, filmmaker, and composer who rose to fame in the era of silent film. His iconic character "The Tramp" became one of the most recognizable figures in cinema history.

Born in London to music hall entertainers, Chaplin's childhood was marked by poverty and hardship. He began performing at a young age and joined a traveling comedy troupe before moving to America in 1913.

Chaplin revolutionized cinema with his unique blend of slapstick comedy and pathos. His films tackled serious social issues while maintaining universal appeal. Works like "City Lights", "Modern Times", and "The Great Dictator" demonstrated his genius for combining comedy with powerful social commentary.

As a filmmaker, Chaplin was a perfectionist who wrote, directed, produced, edited, and composed music for most of his films. His influence on cinema and comedy is immeasurable.`,
    famousWorks: [
      'The Kid (1921)',
      'The Gold Rush (1925)',
      'City Lights (1931)',
      'Modern Times (1936)',
      'The Great Dictator (1940)',
      'Limelight (1952)'
    ],
    style: 'Physical comedy, pantomime, visual storytelling with emotional depth',
    achievements: [
      'Academy Honorary Award (1972)',
      'Three Academy Awards (Honorary, Best Score, Best Actor nomination)',
      'Knighted by Queen Elizabeth II (1975)',
      'AFI ranked "The Tramp" as the greatest movie character of all time',
      'Co-founder of United Artists studio'
    ]
  },
  {
    id: 'jim-carrey',
    name: 'Jim Carrey',
    slug: 'jim-carrey',
    birthYear: 1962,
    nationality: 'Canadian-American',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    shortBio: 'Rubber-faced comedy genius',
    bio: `Jim Carrey is a Canadian-American actor and comedian known for his energetic slapstick performances and elastic facial expressions. He became one of the biggest comedy stars of the 1990s with his unique brand of physical comedy.

Born in Newmarket, Ontario, Carrey developed his comedy skills performing in Toronto comedy clubs. After moving to Los Angeles, he landed a role on the sketch comedy show "In Living Color", which showcased his incredible range of characters and impressions.

Carrey's breakthrough in film came with "Ace Ventura: Pet Detective" (1994), followed by a string of hits including "The Mask", "Dumb and Dumber", and "Liar Liar". He later demonstrated his dramatic range in films like "The Truman Show", "Man on the Moon", and "Eternal Sunshine of the Spotless Mind".

Known for his commitment to physical comedy and willingness to completely transform for roles, Carrey has influenced a generation of comedians with his fearless, over-the-top style.`,
    famousWorks: [
      'Ace Ventura: Pet Detective (1994)',
      'The Mask (1994)',
      'Dumb and Dumber (1994)',
      'Liar Liar (1997)',
      'The Truman Show (1998)',
      'Man on the Moon (1999)',
      'Eternal Sunshine of the Spotless Mind (2004)',
      'Yes Man (2008)'
    ],
    style: 'Extreme physical comedy, exaggerated facial expressions, improvisational genius',
    achievements: [
      'Two Golden Globe Awards',
      'MTV Movie Awards for Best Comedic Performance',
      'First actor to earn $20 million for a single film',
      'Hollywood Walk of Fame star',
      'Successful painter and political cartoonist'
    ]
  },
  {
    id: 'robin-williams',
    name: 'Robin Williams',
    slug: 'robin-williams',
    birthYear: 1951,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    shortBio: 'Improvisational master and beloved actor',
    bio: `Robin Williams was an American actor and comedian renowned for his improvisational skills and wide range of voices and characters. His rapid-fire comedy style and ability to seamlessly transition from comedy to drama made him one of the most beloved entertainers of his generation.

Born in Chicago, Williams studied theater at Juilliard before starting his career in stand-up comedy in San Francisco. He gained fame as the alien Mork in "Mork & Mindy" (1978-1982), which showcased his improvisational genius.

Williams' film career spanned both comedy and drama, earning critical acclaim for roles in "Good Morning, Vietnam", "Dead Poets Society", "The Fisher King", "Good Will Hunting" (which won him an Oscar), and "Mrs. Doubtfire". His voice work as the Genie in Disney's "Aladdin" revolutionized animated film voice acting.

Known for his generosity, humanitarian work, and ability to make anyone laugh, Williams left an indelible mark on comedy and film. His legacy continues to inspire comedians and actors worldwide.`,
    famousWorks: [
      'Mork & Mindy (1978-1982)',
      'Good Morning, Vietnam (1987)',
      'Dead Poets Society (1989)',
      'Aladdin (1992)',
      'Mrs. Doubtfire (1993)',
      'Good Will Hunting (1997)',
      'Patch Adams (1998)',
      'Night at the Museum series'
    ],
    style: 'Rapid-fire improvisation, voices and impressions, emotional range',
    achievements: [
      'Academy Award for Best Supporting Actor',
      'Two Emmy Awards',
      'Six Golden Globe Awards',
      'Cecil B. DeMille Award',
      'Screen Actors Guild Life Achievement Award',
      'Grammy Awards for comedy albums'
    ]
  },
  {
    id: 'lucille-ball',
    name: 'Lucille Ball',
    slug: 'lucille-ball',
    birthYear: 1911,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    shortBio: 'TV comedy pioneer and I Love Lucy star',
    bio: `Lucille Ball was an American actress, comedian, and producer who revolutionized television comedy. Best known for her iconic role as Lucy Ricardo in "I Love Lucy", she became one of the most beloved entertainers of the 20th century and a trailblazer for women in television production.

Born in Jamestown, New York, Ball began her career as a model and actress in the 1930s. She appeared in numerous films before finding her true calling in television. With her husband Desi Arnaz, she created and starred in "I Love Lucy" (1951-1957), which became one of the most successful TV shows of all time.

Ball's physical comedy, impeccable timing, and expressive face made her a master of the sitcom format. Beyond performing, she was a savvy businesswoman who, through Desilu Productions, produced groundbreaking shows like "Star Trek" and "Mission: Impossible".

As one of the first women to run a major television production company, Ball broke barriers and paved the way for future generations of female comedians and producers.`,
    famousWorks: [
      'I Love Lucy (1951-1957)',
      'The Lucy Show (1962-1968)',
      'Here\'s Lucy (1968-1974)',
      'Desilu Productions founder',
      'Producer of Star Trek, Mission: Impossible'
    ],
    style: 'Physical comedy, slapstick, expressive facial reactions, perfect timing',
    achievements: [
      'Four Emmy Awards',
      'Kennedy Center Honors',
      'Presidential Medal of Freedom',
      'First woman to head a major television production studio',
      'Television Hall of Fame inductee',
      'Hollywood Walk of Fame stars (TV, Film, Radio)'
    ]
  },
  {
    id: 'richard-pryor',
    name: 'Richard Pryor',
    slug: 'richard-pryor',
    birthYear: 1940,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    shortBio: 'Groundbreaking stand-up revolutionary',
    bio: `Richard Pryor was an American stand-up comedian, actor, and writer who is widely regarded as one of the greatest and most influential comedians of all time. His raw, honest, and often controversial comedy broke barriers and paved the way for future generations of comedians.

Born in Peoria, Illinois, Pryor grew up in difficult circumstances that would later inform much of his comedy. He began performing stand-up in the 1960s, initially imitating Bill Cosby's style before finding his own authentic voice.

Pryor's comedy was groundbreaking in its honesty about race, social issues, and personal struggles. His willingness to discuss taboo subjects and his raw emotional vulnerability on stage revolutionized stand-up comedy. His concert films, particularly "Richard Pryor: Live in Concert" (1979), are considered masterpieces of the form.

Beyond stand-up, Pryor had a successful film career, starring in comedies like "Silver Streak", "Stir Crazy", and "See No Evil, Hear No Evil". His influence on comedy is immeasurable, inspiring countless comedians including Eddie Murphy, Chris Rock, and Dave Chappelle.`,
    famousWorks: [
      'That Nigger\'s Crazy (1974)',
      'Richard Pryor: Live in Concert (1979)',
      'Silver Streak (1976)',
      'Stir Crazy (1980)',
      'The Toy (1982)',
      'Brewster\'s Millions (1985)'
    ],
    style: 'Raw, honest, confessional, racially and socially conscious',
    achievements: [
      'Five Grammy Awards for comedy albums',
      'Emmy Award',
      'Mark Twain Prize for American Humor (1998)',
      'Kennedy Center Honors',
      'First recipient of Kennedy Center Mark Twain Prize',
      'Ranked #1 on Comedy Central\'s list of all-time greatest stand-ups'
    ]
  },
  {
    id: 'george-carlin',
    name: 'George Carlin',
    slug: 'george-carlin',
    birthYear: 1937,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    shortBio: 'Counterculture icon and wordsmith',
    bio: `George Carlin was an American stand-up comedian, actor, author, and social critic known for his dark comedy and reflections on politics, language, psychology, religion, and taboo subjects. Over five decades, he became one of the most important and influential stand-up comedians in American history.

Born in New York City, Carlin began his career in radio before transitioning to stand-up comedy. In the 1960s, he performed mainstream comedy in a suit and tie. By the 1970s, he had transformed into a counterculture figure with long hair and a beard, focusing on social commentary and challenging societal norms.

Carlin's "Seven Words You Can Never Say on Television" routine led to a landmark Supreme Court case on censorship. His comedy evolved throughout his career, becoming increasingly critical of American culture, consumerism, and politics while maintaining his sharp observational humor and love of language.

With 14 HBO specials and numerous bestselling books, Carlin's legacy as a fearless social commentator and master of language continues to influence comedians and free speech advocates.`,
    famousWorks: [
      'Class Clown (1972)',
      'FM & AM (1972)',
      'Seven Words You Can Never Say on Television',
      'Jammin\' in New York (1992)',
      'You Are All Diseased (1999)',
      'It\'s Bad for Ya (2008)'
    ],
    style: 'Observational, social criticism, wordplay, dark humor, philosophical',
    achievements: [
      'Five Grammy Awards',
      'Mark Twain Prize for American Humor (2008)',
      '14 HBO comedy specials',
      'Four bestselling books',
      'Ranked #2 on Comedy Central\'s list of all-time greatest stand-ups',
      'Inducted into Comedy Hall of Fame'
    ]
  },
  {
    id: 'whoopi-goldberg',
    name: 'Whoopi Goldberg',
    slug: 'whoopi-goldberg',
    birthYear: 1955,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    shortBio: 'EGOT winner and comedy trailblazer',
    bio: `Whoopi Goldberg is an American actor, comedian, author, and television personality who has achieved EGOT status (Emmy, Grammy, Oscar, Tony). She is one of the few entertainers to have won all four major American entertainment awards and one of the most versatile performers in entertainment history.

Born Caryn Johnson in New York City, she adopted the stage name "Whoopi Goldberg" and began performing comedy in San Francisco. Her one-woman show caught the attention of Steven Spielberg, who cast her in "The Color Purple" (1985), earning her an Academy Award nomination.

Goldberg won the Oscar for Best Supporting Actress for "Ghost" (1990) and starred in numerous successful films including "Sister Act" and its sequel. Her comedy is known for its intelligence, social awareness, and ability to tackle serious subjects with humor.

Since 2007, she has been a co-host of "The View", where she continues to share her perspectives on current events, politics, and social issues. Her career spans stand-up, film, television, Broadway, and writing, making her one of the most accomplished entertainers of her generation.`,
    famousWorks: [
      'The Color Purple (1985)',
      'Ghost (1990)',
      'Sister Act series',
      'Star Trek: The Next Generation',
      'The View (2007-present)',
      'Whoopi Goldberg: Direct from Broadway (1985)'
    ],
    style: 'Character-based, socially conscious, versatile, warm and intelligent',
    achievements: [
      'Academy Award for Best Supporting Actress',
      'Grammy Award',
      'Tony Award',
      'Emmy Awards (multiple)',
      'EGOT winner',
      'Hollywood Walk of Fame star',
      'Mark Twain Prize for American Humor (2001)'
    ]
  },
  {
    id: 'steve-martin',
    name: 'Steve Martin',
    slug: 'steve-martin',
    birthYear: 1945,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    shortBio: 'Wild and crazy guy turned Renaissance man',
    bio: `Steve Martin is an American actor, comedian, writer, producer, and musician whose career spans over five decades. He is one of the most successful and influential comedians in American entertainment, known for his absurdist comedy and later his work as a serious actor and author.

Born in Waco, Texas, Martin began his career writing for television variety shows including "The Smothers Brothers Comedy Hour" and "The Sonny and Cher Comedy Hour". He developed his stand-up act in the 1970s, becoming famous for his absurdist comedy, including his "wild and crazy guy" character, and props like the arrow-through-the-head.

Martin transitioned to film in the late 1970s with "The Jerk" and became a major movie star in comedies like "Planes, Trains & Automobiles", "Roxanne", "Father of the Bride", and "Bowfinger". He has also written several bestselling books and plays, and is an accomplished banjo player who has won Grammy Awards for bluegrass music.

A true Renaissance man, Martin has successfully pursued multiple artistic endeavors while maintaining his status as one of comedy's most influential figures.`,
    famousWorks: [
      'The Jerk (1979)',
      'The Man with Two Brains (1983)',
      'Planes, Trains & Automobiles (1987)',
      'Roxanne (1987)',
      'Father of the Bride series',
      'Bowfinger (1999)',
      'Shopgirl (novel)',
      'Let\'s Get Small (album)'
    ],
    style: 'Absurdist, prop comedy, intellectual humor, self-deprecating',
    achievements: [
      'Emmy Awards',
      'Grammy Awards (multiple)',
      'Mark Twain Prize for American Humor (2005)',
      'Kennedy Center Honors (2007)',
      'Honorary Academy Award (2013)',
      'New York Times bestselling author',
      'Accomplished banjo player and composer'
    ]
  },
  {
    id: 'chris-rock',
    name: 'Chris Rock',
    slug: 'chris-rock',
    birthYear: 1965,
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    shortBio: 'Sharp social commentator and SNL alumnus',
    bio: `Chris Rock is an American comedian, actor, writer, producer, and director known for his sharp observations on American politics, race relations, and popular culture. He is widely regarded as one of the greatest stand-up comedians of all time.

Born in Andrews, South Carolina and raised in Brooklyn, New York, Rock began performing stand-up at age 18. He caught the attention of Eddie Murphy, who gave him his first film role in "Beverly Hills Cop II". He joined Saturday Night Live in 1990, raising his profile as a comedian.

Rock's breakthrough came with his 1996 HBO special "Bring the Pain", which won him two Emmy Awards and established him as one of comedy's premier voices. His comedy tackles controversial subjects with intelligence and fearlessness, particularly issues of race and relationships.

Beyond stand-up, Rock has had success in film (both acting and directing), television, and as a voice actor. His influence on contemporary comedy is significant, with many comedians citing him as an inspiration for his willingness to address difficult subjects with both humor and insight.`,
    famousWorks: [
      'Bring the Pain (1996)',
      'Bigger & Blacker (1999)',
      'Never Scared (2004)',
      'Everybody Hates Chris (creator)',
      'Top Five (2014)',
      'Madagascar franchise (voice)',
      'Saturday Night Live (1990-1993)'
    ],
    style: 'Sharp social commentary, observational, relationship humor, political',
    achievements: [
      'Four Emmy Awards',
      'Three Grammy Awards',
      'Ranked #5 on Comedy Central\'s list of all-time greatest stand-ups',
      'Peabody Award',
      'Writer and director of successful films',
      'Hollywood Walk of Fame star'
    ]
  }
];

export function getComedianBySlug(slug) {
  return comedians.find(c => c.slug === slug);
}

export function getAllComedianSlugs() {
  return comedians.map(c => c.slug);
}