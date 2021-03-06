﻿using Microsoft.EntityFrameworkCore;
using OilTycoon.Database.ef;
using OilTycoon.Database.interfaces;
using System.Threading.Tasks;

namespace OilTycoon.Database.repo
{
    public class FuelQuoteRepository : BaseRepository<FuelQuote>, IFuelQuoteRepository
    {
        // This "repository" extends BaseRepository<T> so it automatically has all the methods
        // that BaseRepository<T> has, but specifically for the type of "repository" this is.
        // In this case, this is a "User" repository, so if you called a BaseRepository<T> method
        // from some other class using the UserRepository class, then you would add them to the User table!
        public FuelQuoteRepository(IUnitOfWork uow) : base(uow)
        {
        }

        public async Task<bool> HasOrderedFuelBefore(int userId) => await _uow.GetWhere<FuelQuote>(e => e.UserId == userId).AnyAsync();
    }
}
