import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: string;
    }[];
  };
  readingTime: number
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
            <span> {post.first_publication_date} </span>
          </time>
          <address>
            <FiUser size={20} />
            <span> {post.data.author} </span>
          </address>
          <p>
            <FiClock size={20} />
            <span> {post.readingTime} min </span>
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
                  dangerouslySetInnerHTML={{ __html: String(content.body) }}
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
    pageSize: 1
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
  const response = await prismic.getByUID('posts', String(slug));

  const readingTime = response.data.content.reduce((prev, content) => {
    const headingSplit = content.heading.split(' ')
    const textSplit = RichText.asText(content.body).split(' ')
    const minutes = (headingSplit.length + textSplit.length) / 200
    return prev + Math.ceil(minutes)
  }, 0)

  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      "dd/MM/yyyy",
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      author: 'Gustavo',
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: RichText.asHtml(content.body)
      }))
    },
    readingTime: readingTime
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 2
  }
};
