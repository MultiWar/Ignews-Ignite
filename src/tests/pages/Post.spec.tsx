import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[postId]'
import { getPrismicClient } from '../../services/prismic'
import { stripe } from '../../services/stripe'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

const post = {slug: 'fake-post-1', title: 'Fake post 1', content: '<p>post excerpt</p>', updatedAt: '10 de abril'}

describe('Single Post page', () => {
    it('renders correctly', () => {

        render(<Post post={post} />)

        expect(screen.getByText('Fake post 1')).toBeInTheDocument()
        expect(screen.getByText('post excerpt')).toBeInTheDocument()
    })

    it('redirects user if no active subscription is found', async () => {
        const getSessionMocked = mocked(getSession)
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({
            params: {
                postId: 'fake-post-1'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/posts/preview/fake-post-1',
                    permanent: false
                }
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'Heading', text: "Fake post 1" }
                    ],
                    content: [
                        { type: 'paragraph', text: 'post content' }
                    ]
                },
                last_publication_date: '04-10-2021'
            })
        } as any)

        const response = await getServerSideProps({
            params: {
                postId: 'fake-post-1'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'fake-post-1',
                        title: 'Fake post 1',
                        content: '<p>post content</p>',
                        updatedAt: '10 de abril de 2021'
                    }
                }
            })
        )
    })
})