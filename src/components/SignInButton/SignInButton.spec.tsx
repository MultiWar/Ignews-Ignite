import { fireEvent, render, screen } from "@testing-library/react"
import { SignInButton } from "."
import { mocked } from 'ts-jest/utils'
import { signIn, signOut, useSession } from 'next-auth/client'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
    it('should render correctly when user is not logged in', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(
            <SignInButton />
        )

        expect(screen.getByText('Sign In with GitHub')).toBeInTheDocument()
    })

    it('should render correctly when user is logged in', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValue([
            {user: {name: 'John Doe', email: 'john.doe@example.com'}, expires: 'at some point, yes'},
            false])

        render(
            <SignInButton />
        )

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('logs user in when user is not logged in and clicks in it', () => {
        const useSessionMocked = mocked(useSession)
        const signInMocked = mocked(signIn)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SignInButton />)

        const signInButton = screen.getByText('Sign In with GitHub')

        fireEvent.click(signInButton)
        
        expect(signInMocked).toHaveBeenCalledWith('github')
    })

    it('logs user out when user is logged in and clicks in it', () => {
        const useSessionMocked = mocked(useSession)
        const signOutMocked = mocked(signOut)

        useSessionMocked.mockReturnValue([
            {user: {name: 'John Doe', email: 'john.doe@example.com'}, expires: 'at some point, yes'}, false
        ])

        render(<SignInButton />)

        const signInButton = screen.getByText('John Doe')

        fireEvent.click(signInButton)

        expect(signOutMocked).toHaveBeenCalled()
    })
})