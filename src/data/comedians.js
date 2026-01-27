// src/data/comedians.js
// Database of famous comedians with biographical content

export const comedians = [
  {
    id: 'eddie-murphy',
    name: 'Eddie Murphy',
    slug: 'eddie-murphy',
    birthYear: 1961,
    nationality: 'American',
    image: require('@/assets/images/img_Eddie_Murphy.jpg'),
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
  id: 'adel-imam',
  name: 'Adel Imam',
  slug: 'adel-imam',
  birthYear: 1940,
  nationality: 'Egyptian',
  image: require('@/assets/images/img_Adel_Imam.jpg'),
  shortBio: 'Arab comedy legend and cultural icon',
  bio: `Adel Imam is an Egyptian actor and comedian widely regarded as one of the greatest and most influential comedians in the Arab world. Known as "El Za'eem" (The Leader), Imam has dominated Arabic cinema and television for over five decades, using comedy to address social and political issues in Egyptian and Arab society.

Born in Al Mansoura, Egypt, Imam studied agriculture at Cairo University but found his true calling in theater and comedy. He began his career in the 1960s performing in university theater before transitioning to film and television. His comedic style combines physical humor with sharp social satire, making him accessible to audiences across class and educational backgrounds.

Imam's films and television series have broken box office records throughout the Middle East and North Africa. He has fearlessly tackled controversial subjects including corruption, religious extremism, bureaucracy, and social hypocrisy through his comedic work. His character portrayals often represent the everyday Egyptian struggling against societal and governmental obstacles, making him deeply beloved by millions. Despite facing legal challenges and controversies for some of his more provocative work, Imam remains an iconic figure who shaped Arabic comedy and entertainment.`,
  famousWorks: [
    'The Terrorist (1994)',
    'Al-Irhab wal Kabab (Terrorism and Kebab) (1992)',
    'Al-Mansy (The Forgotten) (1993)',
    'Al-Zaeem (The Leader) series',
    'Birds of Darkness (1995)',
    'Hassan and Morcos (2008)',
    'The Yacoubian Building (2006)'
  ],
  style: 'Social satire, physical comedy, political commentary, relatable characters',
  achievements: [
    'Best Actor at numerous Arab film festivals',
    'Cairo International Film Festival lifetime achievement',
    'Star on the Egyptian Walk of Fame',
    'UN Goodwill Ambassador',
    'Decorated by Egyptian government',
    'Hundreds of films and TV series spanning 50+ years',
    'Most commercially successful actor in Arab cinema history'
  ]
},
  {
    id: 'charlie-chaplin',
    name: 'Charlie Chaplin',
    slug: 'charlie-chaplin',
    birthYear: 1889,
    nationality: 'British',
    image: require('@/assets/images/img_Charlie_Chaplin.jpg'),
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
    image: require('@/assets/images/img_Jim_Carrey.jpg'),
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
    image: require('@/assets/images/img_Robin_Williams.png'),
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
    image: require('@/assets/images/img_Lucille_Ball.png'),
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
    image: require('@/assets/images/img_Richard_Pryor.png'),
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
    image: require('@/assets/images/img_George_Carlin.png'),
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
    image: require('@/assets/images/img_Whoopi_Goldberg.jpg'),
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
    image: require('@/assets/images/img_Steve_Martin.jpeg'),
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
    image: require('@/assets/images/img_Chris_Rock.jpeg'),
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
  },
{
  id: 'kevin-hart',
  name: 'Kevin Hart',
  slug: 'kevin-hart',
  birthYear: 1979,
  nationality: 'American',
  image: require('@/assets/images/img_Kevin_Hart.jpg'),
  shortBio: 'High-energy comedy powerhouse',
  bio: `Kevin Hart is an American comedian and actor who has become one of the highest-grossing stand-up comedians and most recognizable entertainment figures worldwide. His energetic performance style and relatable humor about family, relationships, and everyday life have made him a global phenomenon.

Born in Philadelphia, Hart began his comedy career performing at amateur nights in local clubs. After years of persistence and refinement of his craft, he broke through with his Comedy Central special "I'm a Grown Little Man" in 2009, followed by the massively successful "Laugh at My Pain" tour.

Hart has since dominated both stand-up comedy and film, starring in numerous box office hits while continuing to sell out arenas worldwide. His tours consistently break attendance records, and his work ethic and business acumen have established him as one of entertainment's most successful entrepreneurs. He has parlayed his comedy success into film production, a media company, and various business ventures.`,
  famousWorks: [
    'Laugh at My Pain (2011)',
    'Let Me Explain (2013)',
    'What Now? (2016)',
    'Irresponsible (2019)',
    'Jumanji series',
    'Ride Along series',
    'Central Intelligence (2016)',
    'The Upside (2017)'
  ],
  style: 'High-energy, self-deprecating, physical comedy, relatable storytelling',
  achievements: [
    'Multiple sold-out arena tours',
    'Highest-grossing comedy tours worldwide',
    'Time 100 most influential people',
    'Producers Guild Award',
    'Successful production company',
    'Hollywood Walk of Fame star'
  ]
},
{
  id: 'ricky-gervais',
  name: 'Ricky Gervais',
  slug: 'ricky-gervais',
  birthYear: 1961,
  nationality: 'British',
  image: require('@/assets/images/img_Ricky_Gervais.jpg'),
  shortBio: 'Creator of The Office and fearless host',
  bio: `Ricky Gervais is a British comedian, actor, writer, and director who revolutionized television comedy with "The Office" and became known for his provocative humor and willingness to mock celebrity culture. His influence on modern comedy spans multiple continents and has redefined the sitcom format.

Born in Reading, England, Gervais initially pursued a career in music and radio before finding his calling in comedy. He co-created and starred in "The Office" in 2001, which became a cultural phenomenon and spawned successful adaptations worldwide, most notably the American version.

Gervais has hosted the Golden Globe Awards multiple times, earning both praise and controversy for his sharp, irreverent hosting style. His stand-up specials showcase his atheistic views, animal rights activism, and willingness to tackle taboo subjects. Beyond comedy, he has created several acclaimed television series and continues to be one of the most talked-about comedians in the world.`,
  famousWorks: [
    'The Office (UK) (2001-2003)',
    'Extras (2005-2007)',
    'After Life (2019-2022)',
    'Humanity (2018)',
    'SuperNature (2022)',
    'Golden Globe Awards host',
    'An Idiot Abroad (creator)'
  ],
  style: 'Observational, provocative, satirical, dry British wit',
  achievements: [
    'Golden Globe Awards',
    'BAFTA Awards',
    'Emmy Awards',
    'Time 100 most influential people',
    'International Emmy Founders Award',
    'Comedy Awards (UK)'
  ]
},
{
  id: 'bill-burr',
  name: 'Bill Burr',
  slug: 'bill-burr',
  birthYear: 1968,
  nationality: 'American',
  image: require('@/assets/images/img_Bill_Burr.jpg'),
  shortBio: 'Unfiltered Boston truth-teller',
  bio: `Bill Burr is an American stand-up comedian, actor, and podcaster known for his honest, aggressive style and rants about modern life, sports, and gender dynamics. His no-nonsense approach and willingness to express unpopular opinions have made him one of comedy's most respected voices.

Born in Canton, Massachusetts, Burr moved to New York City to pursue comedy in the early 1990s. He spent years developing his craft in clubs before gaining wider recognition. His breakout moment came with viral videos of his performances, particularly his legendary Philadelphia incident where he turned a hostile crowd in his favor.

Burr's Netflix specials have been critically acclaimed, and he has successfully transitioned into acting with roles in "Breaking Bad" and his own series "F is for Family." His podcast "Monday Morning Podcast" has become one of the most popular in comedy, showcasing his ability to connect with audiences through long-form conversation and improvisation.`,
  famousWorks: [
    'Paper Tiger (2019)',
    'Walk Your Way Out (2017)',
    'F is for Family (creator)',
    'Monday Morning Podcast',
    'Breaking Bad',
    'The Mandalorian',
    'Old Dads (2023)'
  ],
  style: 'Aggressive, honest, observational rants, Boston accent and attitude',
  achievements: [
    'Grammy Award nomination',
    'Emmy nominations',
    'Successful podcast with millions of listeners',
    'Sold-out arena tours worldwide',
    'Critical acclaim for stand-up specials',
    'Successful voice acting and animation work'
  ]
},
{
  id: 'ali-wong',
  name: 'Ali Wong',
  slug: 'ali-wong',
  birthYear: 1982,
  nationality: 'American',
  image: require('@/assets/images/img_Ali_Wong.jpg'),
  shortBio: 'Groundbreaking and unapologetically honest',
  bio: `Ali Wong is an American comedian and actress who broke barriers with her bold, unapologetic comedy about pregnancy, motherhood, marriage, and female sexuality. Her groundbreaking Netflix special "Baby Cobra," performed while seven months pregnant, became a cultural phenomenon and redefined what mainstream comedy could address.

Born in San Francisco to a Vietnamese mother and Chinese-American father, Wong studied Asian American Studies at UCLA before moving to New York to pursue stand-up comedy. She spent years performing at clubs and appearing in television shows before her breakthrough Netflix specials.

Wong's comedy is refreshingly honest about topics often considered taboo, presented with confidence and sharp wit. Beyond stand-up, she has starred in romantic comedy films, written a bestselling book, and created the Netflix series "Beef," which earned critical acclaim and multiple Emmy Awards. She represents a new generation of comedians who use their unique perspectives to challenge conventions and expand comedy's boundaries.`,
  famousWorks: [
    'Baby Cobra (2016)',
    'Hard Knock Wife (2018)',
    'Don Wong (2022)',
    'Beef (2023)',
    'Always Be My Maybe (2019)',
    'American Housewife',
    'Dear Girls (book)'
  ],
  style: 'Bold, honest, feminist perspective, taboo-breaking humor',
  achievements: [
    'Emmy Awards for Beef',
    'Golden Globe Award',
    'New York Times bestselling author',
    'Time 100 most influential people',
    'Breakthrough Netflix specials',
    'Critical acclaim for acting and writing'
  ]
},
{
  id: 'trevor-noah',
  name: 'Trevor Noah',
  slug: 'trevor-noah',
  birthYear: 1984,
  nationality: 'South African',
  image: require('@/assets/images/img_Trevor_Noah.jpg'),
  shortBio: 'Daily Show host and global perspective',
  bio: `Trevor Noah is a South African comedian, television host, and political commentator who became internationally known as host of "The Daily Show" on Comedy Central from 2015 to 2022. His unique perspective as someone born during apartheid in South Africa has given him a distinctive voice in American comedy and political commentary.

Born in Johannesburg during apartheid to a black South African mother and white Swiss father, Noah's existence was itself illegal under apartheid law. His memoir "Born a Crime" details his extraordinary childhood and became a bestseller. He began his career in South Africa as a comedian, actor, and television host before gaining international attention with his stand-up.

Noah's tenure on "The Daily Show" showcased his ability to analyze American politics and culture from an outsider's perspective, offering insights that resonated with diverse audiences. His stand-up specials demonstrate his skill at navigating different cultures and languages, making him one of the most internationally successful comedians of his generation.`,
  famousWorks: [
    'The Daily Show (2015-2022)',
    'Born a Crime (memoir)',
    'Son of Patricia (2018)',
    'Afraid of the Dark (2017)',
    'I Wish You Would (2022)',
    'The Daily Show global correspondent'
  ],
  style: 'Political satire, cultural observation, multilingual, international perspective',
  achievements: [
    'Emmy nominations',
    'NAACP Image Awards',
    'New York Times bestselling author',
    'Time 100 most influential people',
    'Successful world tours',
    'Primetime Emmy Award'
  ]
},
{
  id: 'amy-schumer',
  name: 'Amy Schumer',
  slug: 'amy-schumer',
  birthYear: 1981,
  nationality: 'American',
  image: require('@/assets/images/img_Amy_Schumer.jpg'),
  shortBio: 'Fearless feminist comedy voice',
  bio: `Amy Schumer is an American stand-up comedian, actress, and writer known for her feminist comedy and willingness to discuss topics like sex, relationships, and body image with unprecedented frankness. She became a major force in comedy through her Comedy Central series "Inside Amy Schumer" and mainstream film success.

Born in New York City, Schumer studied theater before pursuing stand-up comedy. Her breakthrough came with her fourth-place finish on "Last Comic Standing" in 2007, but she truly exploded into the mainstream with her Comedy Central show, which won a Peabody Award for its sharp social commentary and sketch comedy.

Schumer's film "Trainwreck," which she wrote and starred in, was both a critical and commercial success, establishing her as a leading voice in comedy. She has used her platform to advocate for gun control, women's rights, and body positivity. Her comedy continues to challenge societal expectations while maintaining broad appeal through her relatable, self-deprecating style.`,
  famousWorks: [
    'Inside Amy Schumer (2013-2016)',
    'Trainwreck (2015)',
    'The Leather Special (2017)',
    'Growing (2019)',
    'I Feel Pretty (2018)',
    'Snatched (2017)',
    'Life & Beth (2022)'
  ],
  style: 'Feminist, sex-positive, self-deprecating, social commentary',
  achievements: [
    'Emmy Award',
    'Peabody Award',
    'Time 100 most influential people',
    'New York Times bestselling author',
    'Grammy nomination',
    'Writers Guild Award'
  ]
},
{
  id: 'hasan-minhaj',
  name: 'Hasan Minhaj',
  slug: 'hasan-minhaj',
  birthYear: 1985,
  nationality: 'American',
  image: require('@/assets/images/img_Hasan_Minhaj.jpg'),
  shortBio: 'Political comedy meets personal storytelling',
  bio: `Hasan Minhaj is an American comedian, writer, and television host known for blending political commentary with deeply personal storytelling. His unique ability to discuss serious issues like immigration, politics, and identity while maintaining humor and authenticity has made him a distinctive voice in modern comedy.

Born in Davis, California to Indian Muslim immigrant parents, Minhaj studied political science before pursuing comedy. He gained recognition as a correspondent on "The Daily Show with Jon Stewart" before creating and hosting his own Netflix series "Patriot Act with Hasan Minhaj," which combined investigative journalism with comedy.

Minhaj's stand-up specials, particularly "Homecoming King," showcase his talent for weaving personal experiences as a first-generation American with broader political and social commentary. His work addresses issues facing immigrant communities, the Muslim-American experience, and contemporary politics with intelligence, humor, and emotional depth.`,
  famousWorks: [
    'Patriot Act with Hasan Minhaj (2018-2020)',
    'Homecoming King (2017)',
    'The King\'s Jester (2022)',
    'The Daily Show correspondent',
    'White House Correspondents\' Dinner (2017)'
  ],
  style: 'Political satire, personal storytelling, investigative comedy',
  achievements: [
    'Peabody Award',
    'Emmy Award',
    'White House Correspondents\' Dinner host',
    'Time 100 most influential people',
    'Webby Awards',
    'Television Critics Association Award'
  ]
},
{
  id: 'john-mulaney',
  name: 'John Mulaney',
  slug: 'john-mulaney',
  birthYear: 1982,
  nationality: 'American',
  image: require('@/assets/images/img_John_Mulaney.jpg'),
  shortBio: 'Sharp wit and impeccable storytelling',
  bio: `John Mulaney is an American stand-up comedian, actor, and writer known for his clever wordplay, pristine delivery, and masterful storytelling. His clean yet sophisticated comedy style, reminiscent of classic comedians while remaining distinctly modern, has earned him critical acclaim and a devoted fanbase.

Born in Chicago, Mulaney studied English literature before moving to New York to pursue comedy. He worked as a writer for "Saturday Night Live" from 2008 to 2013, co-creating memorable characters like Stefon with Bill Hader. His stand-up career took off with acclaimed specials that showcase his gift for crafting perfectly structured jokes and relatable observations.

Mulaney's comedy often draws from his Catholic upbringing, his experiences in New York, and astute observations about modern life. Beyond stand-up, he has created and starred in sitcoms, hosted "Saturday Night Live" multiple times, and created the successful children's show "Big Mouth." His ability to appeal to diverse audiences while maintaining artistic integrity has made him one of the most respected comedians of his generation.`,
  famousWorks: [
    'Kid Gorgeous (2018)',
    'Baby J (2023)',
    'The Comeback Kid (2015)',
    'New in Town (2012)',
    'Big Mouth (co-creator)',
    'Documentary Now!',
    'SNL writer and multiple-time host'
  ],
  style: 'Storytelling, wordplay, observational, clean but sophisticated',
  achievements: [
    'Emmy Awards (multiple)',
    'Peabody Award',
    'Writers Guild Awards',
    'Grammy nomination',
    'Critical acclaim for stand-up specials',
    'Successful Broadway show'
  ]
},
{
  id: 'bo-burnham',
  name: 'Bo Burnham',
  slug: 'bo-burnham',
  birthYear: 1990,
  nationality: 'American',
  image: require('@/assets/images/img_Bo_Burnham.jpg'),
  shortBio: 'Musical comedy innovator and filmmaker',
  bio: `Bo Burnham is an American comedian, musician, actor, and filmmaker who rose to fame through YouTube before becoming one of comedy's most innovative and introspective voices. His unique blend of music, comedy, and social commentary, combined with his willingness to explore mental health and existential themes, has redefined what comedy specials can be.

Born in Hamilton, Massachusetts, Burnham began posting comedy songs on YouTube at age 16 and quickly gained a massive following. He became the youngest person to record a Comedy Central special at age 18. His comedy evolved from clever wordplay and musical parodies to increasingly sophisticated examinations of performance, technology, and modern life.

Burnham's Netflix special "Inside," created entirely by himself during the COVID-19 pandemic, became a cultural phenomenon and earned critical acclaim for its honest exploration of isolation, mental health, and internet culture. He has also found success as a filmmaker, directing the acclaimed film "Eighth Grade." His work continues to push boundaries and challenge what comedy can express.`,
  famousWorks: [
    'Inside (2021)',
    'Make Happy (2016)',
    'what. (2013)',
    'Eighth Grade (2018)',
    'Words, Words, Words',
    'Zach Stone Is Gonna Be Famous',
    'Promising Young Woman (actor)'
  ],
  style: 'Musical comedy, meta-humor, introspective, multimedia performance',
  achievements: [
    'Emmy Awards',
    'Grammy nomination',
    'Peabody Award',
    'Writers Guild Award',
    'Directors Guild nomination',
    'Cultural impact of Inside',
    'Innovative YouTube pioneer'
  ]
}
];

export function getComedianBySlug(slug) {
  return comedians.find(c => c.slug === slug);
}

export function getAllComedianSlugs() {
  return comedians.map(c => c.slug);
}