import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/preview/[postId]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')
jest.mock('next/router')

const post = {slug: 'fake-post-1', title: 'Fake post 1', content: '<p>post excerpt</p>', updatedAt: '10 de abril'}

describe('Post preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<Post post={post} />)

        // screen.logTestingPlaygroundURL()

        expect(screen.getByText('Fake post 1')).toBeInTheDocument()
        expect(screen.getByText('post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Want to continue reading?')).toBeInTheDocument()
        expect(screen.queryByTestId('continue_reading')).toBeInTheDocument()
    })

    it('redirects user to full post if user already has an active subscription', async () => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMocked = jest.fn()

        useSessionMocked.mockReturnValueOnce([{ activeSubscription: 'fake-active-subscription' }, false] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any)

        render(<Post post={post} />)

        expect(pushMocked).toHaveBeenCalledWith('/posts/fake-post-1')
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

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

        const response = await getStaticProps({
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