import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

import { formatInBR } from '../../utils/date';
import { calculateReadingTime } from '../../utils/post';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter()

  if (isFallback) {
    return (
      <article className={`${commonStyles.containerCenter} ${styles.loading}`}>
        Carregando...
      </article>
    )
  }

  const contentPost: string[] = post.data.content.map(content => {
    const heading = content.heading.replace(/(<([^>]+)>)/g, '')
    const body = RichText.asText(content.body)
    return `${heading} ${body}`
  })

  return (
    <>
      <Header />

      <img src={post.data.banner.url} className={styles.image} alt="Title" />

      <article className={commonStyles.containerCenter}>
        <header className={styles.header}>
          <h1> {post.data.title} </h1>
        </header>

        <div className={styles.infos}>
          <time>
            <FiCalendar size={20} />
            <span> {formatInBR(post.first_publication_date, 'dd MMM yyyy')} </span>
          </time>
          <address>
            <FiUser size={20} />
            <span> {post.data.author} </span>
          </address>
          <p>
            <FiClock size={20} />
            <span> {calculateReadingTime(contentPost)} min </span>
          </p>
        </div>

        <div className={styles.content}>
          {post.data.content.map(content => {
            return (
              <div
                key={Math.floor(Math.random() * 1000)}
                className={styles.paragraph}
              >
                <h2>{content.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
                />
              </div>
            )
          })}
        </div>
      </article>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    }
  });

  const paths = postsResponse.results.map(post => {
    return {
      params: { slug: String(post.uid) }
    }
  });

  return {
    paths: paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID(
    'posts',
    String(slug),
    {
      graphQuery: `{
        posts {
          ...postsFields
          author {
            name
          }
        }
      }`
    }
  );

  // Foi necessário mudar esse script para Author, pois a versão atual do prismic so roda author como Relationship.
  // O teste quebra com o author sendo um campo relacional
  // Referencia 1: https://prismic.io/docs/technologies/graphquery-rest-api
  // Referencia 2: https://community.prismic.io/t/how-to-get-authors-name-and-image-of-the-blog-post-published/4763
  let author = ''

  // Verifico se é o mockup do teste, se não é direto do prismic
  if (typeof response.data.author == 'string') {
    author = response.data.author
  } else {
    author = response.data.author ? response.data.author.data.name : ''
  }

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 2
  }
};
