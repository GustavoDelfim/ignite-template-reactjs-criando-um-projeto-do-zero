import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <>
      <Header />

      <img src="/banner.jpg" className={styles.image} alt="Title" />

      <article className={commonStyles.containerCenter}>
        <header className={styles.header}>
          <h1> Criando um app CRA do zero </h1>
        </header>

        <div className={styles.infos}>
          <time>
            <FiCalendar size={20} />
            <span> 15 Mar 2021 </span>
          </time>
          <address>
            <FiUser size={20} />
            <span> Jason Gennaro </span>
          </address>
          <p>
            <FiClock size={20} />
            <span> 4 min </span>
          </p>
        </div>

        <div className={styles.content}>
          das
        </div>
      </article>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
