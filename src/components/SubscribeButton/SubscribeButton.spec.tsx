import { fireEvent, render, screen } from "@testing-library/react"
import { SubscribeButton } from "."
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])
        render(
            <SubscribeButton />
        )

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticated', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])

        const signInMocked = mocked(signIn)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMocked = jest.fn()

        useSessionMocked.mockReturnValue([{
            user: {
                name: 'John Doe', 
                email: 'john.doe@example.com'
            }, 
            expires: 'at some point, yes',
            activeSubscription: 'fake-active-subscription'
        },
        false])

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any)

        render(<SubscribeButton />)
        const subscribeButton = screen.getByText('Subscribe Now')
        fireEvent.click(subscribeButton)

        expect(pushMocked).toHaveBeenCalledWith('/posts')
    })
})