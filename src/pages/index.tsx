import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { PostResume } from '../components/PostResume';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <div className={styles.header}>
        <Header />
      </div>

      <section className={commonStyles.containerCenter}>
        <PostResume />
        <PostResume />
        <PostResume />
        <PostResume />
        <PostResume />
        <PostResume />

        <a className={styles.readMore}> Carregar mais posts </a>
      </section>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
