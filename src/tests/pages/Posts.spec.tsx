import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'
import { stripe } from '../../services/stripe'

interface Post {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
}

jest.mock('../../services/prismic')

const posts: Post[] = [
    {slug: 'fake-post-1', title: 'Fake post 1', excerpt: 'post excerpt', updatedAt: '10 de abril'},
]

describe('Posts page', () => {
    it('renders correctly', () => {

        render(<Posts posts={posts} />)

        expect(screen.getByText('Fake post 1')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'fake-post-1',
                        data: {
                            title: [{
                                type: 'Heading', text: "Fake post 1"
                            }],
                            content: [{
                                type: 'paragraph', text: 'post excerpt'
                            }]
                        },
                        last_publication_date: '04-10-2021'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'fake-post-1',
                        title: 'Fake post 1',
                        excerpt: 'post excerpt',
                        updatedAt: '10 de abril de 2021'
                    }]
                }
            })
        )
    })
})