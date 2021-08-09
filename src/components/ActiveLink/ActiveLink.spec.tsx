import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/',
            }
        }
    }
})

describe('ActiveLink component', () => {
    it('should render correctly', () => {
        render(
            <ActiveLink href='/' activeClassName='active'>
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText('Home')).toBeInTheDocument()
    })
    
    it('should have the active class if href is equal to the path it\'s currently in', () => {
        render(
            <>
                <ActiveLink href='/' activeClassName='active'>
                    <a>Home</a>
                </ActiveLink>
                <ActiveLink href='/posts' activeClassName='active'>
                    <a>Posts</a>
                </ActiveLink>
            </>
        )
    
        expect(screen.getByText('Home')).toHaveClass('active')
        expect(screen.getByText('Posts')).not.toHaveClass('active')
    })
})