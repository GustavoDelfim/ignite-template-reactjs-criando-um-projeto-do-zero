import { GetStaticProps } from 'next';
import { useState } from 'react';
import Header from '../components/Header';
import { PostResume } from '../components/PostResume';

import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)

  function readMore(next_page) {
    fetch(next_page)
      .then((res) => res.json())
      .then((res) => {
        const newPosts = res.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              "dd/MM/yyyy",
              { locale: ptBR }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: 'Gustavo',
            }
          }
        })

        setPosts(old => [...old, ...newPosts])
        setNextPage(_ => res.next_page)
      })
  }

  return (
    <>
      <div className={styles.header}>
        <Header />
      </div>

      <section className={commonStyles.containerCenter}>
        {posts.map(post => {
          return <PostResume
            key={post.uid}
            author={post.data.author}
            first_publication_date={post.first_publication_date}
            uid={post.uid}
            subtitle={post.data.subtitle}
            title={post.data.title}
          />
        })}

        {
          nextPage &&
          <a className={styles.readMore} onClick={() => readMore(nextPage)}>
            Carregar mais posts
          </a>
        }
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1
  });

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        "dd/MM/yyyy",
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: 'Gustavo',
      }
    }
  })

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      }
    },
    revalidate: 60 * 2
  }
};
